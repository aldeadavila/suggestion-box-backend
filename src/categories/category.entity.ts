import { Suggestion } from "src/suggestions/suggestion.entity";
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'categories'})
export class Category {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    name:string

    @Column()
    description:string

    @Column()
    image:string

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    update_at: Date;

    @OneToMany(() => Suggestion, (suggestion) => suggestion.id)
    suggestion: Suggestion
}