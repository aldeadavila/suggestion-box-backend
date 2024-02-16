import { Suggestion } from "src/suggestions/suggestion.entity";
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn  } from "typeorm";

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

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

    @OneToMany(() => Suggestion, (suggestion) => suggestion.id)
    suggestion: Suggestion
}