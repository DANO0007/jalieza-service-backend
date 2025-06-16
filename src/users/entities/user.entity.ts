import {Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    //@PrimaryGeneratedColumn()
    @Column({primary:true, generated: true})
    id:number;

    @Column()
    nombre_usuario: string;

    @Column()
    contrasena: string;

    @Column()
    id_rol: number;

    @Column()
    activo: boolean;

    @DeleteDateColumn()
    deletedAt:Date;
}
