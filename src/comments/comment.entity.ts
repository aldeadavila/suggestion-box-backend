import { User } from "src/users/users.entity";
import { Suggestion } from "src/suggestions/suggestion.entity";
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity({ name: 'comments'})
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_user: number;

    @Column()
    id_suggestion: number;

    @Column()
    content: string;

    @CreateDateColumn({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    update_at: Date;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'id_user'})
    user: User

    @ManyToOne(() => Suggestion, (suggestion) => suggestion.id)
    @JoinColumn({name: 'id_suggestion'})
    suggestion: Suggestion

}