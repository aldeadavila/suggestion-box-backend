import { Category } from "src/categories/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;


    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({name: 'id_category'})
    category: Category

}