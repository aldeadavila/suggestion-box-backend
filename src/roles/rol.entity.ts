import { User } from "src/users/users.entity";
import { Column, Entity, ManyToMany, PrimaryColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity({name: 'roles'})
export class Rol {

    @PrimaryColumn()
    id: string;

    @Column({unique: true})
    name: string

    @Column()
    image: string

    @Column()
    route: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[]
}