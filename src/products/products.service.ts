import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import asyncForEach = require('../utils/async_foreach');
import storage = require('../utils/cloud_storage')

@Injectable()
export class ProductsService {

    constructor(@InjectRepository(Product) private productRepository: Repository<Product>) {}

    async create(files: Array<Express.Multer.File>, product: CreateProductDto) {

        if (files.length === 0) {
            throw new HttpException("Las imágenes son obligatorias", HttpStatus.NOT_FOUND);
        }

        let uploadFiles = 0; // contar cuántos archivos se suben a firebase

        const newProduct = this.productRepository.create(product);
        const savedProduct = await this.productRepository.save(newProduct);

        const startForEach = async () => {
            await asyncForEach(files,async (file:Express.Multer.File) => {
                const url = await storage(file, file.originalname);

                if (url !== undefined && url !== null) {
                    if(uploadFiles === 0) {
                        savedProduct.image1 = url;
                    }

                    else if(uploadFiles === 1) {
                        savedProduct.image2 = url;
                    }
                }

                await this.update(savedProduct.id, savedProduct);
                uploadFiles = uploadFiles + 1;

                
            })
        }
        await startForEach();
        return savedProduct;
    }

    async update(id: number, product: UpdateProductDto) {
        const productFound = await this.productRepository.findOneBy({id: id});
        if(!productFound) {
            throw new HttpException("Producto no encontrado", HttpStatus.NOT_FOUND);
        }
        const updateProduct = Object.assign(productFound, product);
        return this.productRepository.save(updateProduct);
    }
}
