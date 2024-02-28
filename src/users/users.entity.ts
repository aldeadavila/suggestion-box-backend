
import { hash } from "bcrypt";
import { Rol } from "src/roles/rol.entity";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity({name: 'users'})
export class User {

    public $timestamps = false;

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

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

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