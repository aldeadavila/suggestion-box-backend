
import { hash } from "bcrypt";
import { Rol } from "src/roles/rol.entity";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    nickname: string;

    @Column({unique: true})
    email: string;

    @Column({nullable: true})
    image: string;

    @Column()
    password: string;

    @Column({nullable: true})
    notification_token: string;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    update_at: Date;

    @JoinTable({name: 'user_has_roles',
    joinColumn: { name: 'id_user'},
    inverseJoinColumn: {name: 'id_rol'  
    }
    })
    @ManyToMany(() => Rol, (rol) => rol.users)
    roles: Rol[]

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, Number(process.env.HASH_SALT))
    }
}