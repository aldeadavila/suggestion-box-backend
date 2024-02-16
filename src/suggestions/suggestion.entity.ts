import { Category } from "src/categories/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'suggestions'})
export class Suggestion {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_user: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({nullable: true})
    image1: string;

    @Column({nullable: true})
    image2: string;

    @Column()
    id_category: number;

    @CreateDateColumn({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    update_at: Date;


    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({name: 'id_category'})
    category: Category

}