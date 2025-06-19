import { Column, CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()
export class Ciudadanos {
    @Column({primary:true, generated: true})
    id:number;
 
    @Column( { nullable:false})
    nombre:string;

    @Column( { nullable:false})
    apellido_paterno: string;

    @Column( { nullable:false})
    apellido_materno:string;
    
    @Column({ type: 'date', nullable: false })
    fecha_nacimiento:Date;

    @Column( { nullable:false})
    telefono:string;
    
    @Column()
    estado_civil: boolean;

    @Column()
    pareja_id: number;

    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;
    
    @DeleteDateColumn()
    deleted_at: Date;




}
