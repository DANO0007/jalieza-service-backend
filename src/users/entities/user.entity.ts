import {Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Rol} from './../../rol/entities/rol.entity'
@Entity()
export class Usuarios {
    //@PrimaryGeneratedColumn()
   @PrimaryGeneratedColumn()
    id:number;

    @Column( { nullable:false})
    usuario: string;

    @Column( {unique:true, nullable:false})
    email: string;

    @Column({nullable:false})
    contrasena: string;

 // ✅ Relación con la tabla roles
    @ManyToOne(() => Rol, rol => rol.usuarios, { eager: true, onDelete: 'SET NULL',nullable: true })
    @JoinColumn({ name: 'rol_id' }) // Nombre explícito de la columna FK
    rol: Rol;

   @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;


}
