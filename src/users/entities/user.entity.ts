import {Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Usuarios {
    //@PrimaryGeneratedColumn()
    @Column({primary:true, generated: true})
    id_usuario:number;

    @Column( {unique:true, nullable:false})
    nombre_usuario: string;

    @Column({nullable:false})
    contrasena: string;

    @Column()
    id_rol: number;

    @Column()
    activo: boolean;


}
