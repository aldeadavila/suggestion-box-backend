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

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;  
    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'id_user'})
    user: User

    @ManyToOne(() => Suggestion, (suggestion) => suggestion.id)
    @JoinColumn({name: 'id_suggestion'})
    suggestion: Suggestion

}