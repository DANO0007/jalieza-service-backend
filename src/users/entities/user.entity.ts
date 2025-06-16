import {Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    //@PrimaryGeneratedColumn()
    @Column({primary:true, generated: true})
    id:number;

    @Column({nullable:false})
    nombre_usuario: string;

    @Column({nullable:false})
    contrasena: string;

    @Column()
    id_rol: number;

    @Column()
    activo: boolean;

    @DeleteDateColumn()
    deletedAt:Date;
}
