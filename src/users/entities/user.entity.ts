import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Usuarios {
    //@PrimaryGeneratedColumn()
    @Column({primary:true, generated: true})
    id:number;

    @Column( {unique:true, nullable:false})
    usuario: string;

    @Column( {unique:true, nullable:false})
    email: string;

    @Column({nullable:false})
    contrasena: string;

    @Column()
    rol_id: number;

   @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;


}
