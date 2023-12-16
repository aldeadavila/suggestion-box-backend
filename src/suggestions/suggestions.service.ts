import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Suggestion } from './suggestion.entity';
import { Repository } from 'typeorm';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import asyncForEach = require('../utils/async_foreach');
import storage = require('../utils/cloud_storage')

@Injectable()
export class SuggestionsService {

    constructor(@InjectRepository(Suggestion) private suggestionRepository: Repository<Suggestion>) {}

    findAll() {
        return this.suggestionRepository.find();
    }

    findByCategory(id_category: number) {
        return this.suggestionRepository.findBy({id_category: id_category});
    }

    async create(files: Array<Express.Multer.File>, suggestion: CreateSuggestionDto) {

        if (files.length === 0) {
            throw new HttpException("Las imágenes son obligatorias", HttpStatus.NOT_FOUND);
        }

        let uploadFiles = 0; // contar cuántos archivos se suben a firebase

        const newSuggestion = this.suggestionRepository.create(suggestion);
        const savedSuggestion = await this.suggestionRepository.save(newSuggestion);

        const startForEach = async () => {
            await asyncForEach(files,async (file:Express.Multer.File) => {
                const url = await storage(file, file.originalname);

                if (url !== undefined && url !== null) {
                    if(uploadFiles === 0) {
                        savedSuggestion.image1 = url;
                    }

                    else if(uploadFiles === 1) {
                        savedSuggestion.image2 = url;
                    }
                }

                await this.update(savedSuggestion.id, savedSuggestion);
                uploadFiles = uploadFiles + 1;

                
            })
        }
        await startForEach();
        return savedSuggestion;
    }

    async updateWithImages(files: Array<Express.Multer.File>, id: number, suggestion: UpdateSuggestionDto) {

        if (files.length === 0) {
            throw new HttpException("Las imágenes son obligatorias", HttpStatus.NOT_FOUND);
        }

        let counter = 0;
        let uploadFiles = Number(suggestion.images_to_update[counter]); // contar cuántos archivos se suben a firebase

        
        const updateSuggestion = await this.update(id, suggestion);

        const startForEach = async () => {
            await asyncForEach(files,async (file:Express.Multer.File) => {
                const url = await storage(file, file.originalname);

                if (url !== undefined && url !== null) {
                    if(uploadFiles === 0) {
                        updateSuggestion.image1 = url;
                    }

                    else if(uploadFiles === 1) {
                        updateSuggestion.image2 = url;
                    }
                }

                await this.update(updateSuggestion.id, updateSuggestion);
                counter ++;
                uploadFiles = Number(suggestion.images_to_update[counter]);
                
            })
        }
        await startForEach();
        return updateSuggestion;
    }

    async update(id: number, suggestion: UpdateSuggestionDto) {
        const suggestionFound = await this.suggestionRepository.findOneBy({id: id});
        if(!suggestionFound) {
            throw new HttpException("Sugerencia no encontrada", HttpStatus.NOT_FOUND);
        }
        const updateSuggestion = Object.assign(suggestionFound, suggestion);
        return this.suggestionRepository.save(updateSuggestion);
    }

    async delete(id: number) {
        const suggestionFound = await this.suggestionRepository.findOneBy({id: id});
        if(!suggestionFound) {
            throw new HttpException("Sugerencia no encontrada", HttpStatus.NOT_FOUND);
        }
        
        return this.suggestionRepository.delete(id);
    }
}
