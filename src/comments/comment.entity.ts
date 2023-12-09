import { User } from "src/users/users.entity";
import { Suggestion } from "src/suggestions/suggestion.entity";
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'comments'})
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    update_at: Date;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'id_user'})
    user: User

    @ManyToOne(() => Suggestion, (suggestion) => suggestion.id)
    @JoinColumn({name: 'id_suggestion'})
    suggestion: Suggestion

}