import { Column, CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()
export class CatalogoServicio {
    @Column({primary:true, generated: true})
    id:number;

    @Column( { nullable:false})
    nombre_servicio:string;

    @Column( { nullable:false})
    orden_id: number;

    @Column( { nullable:false})
    descripcion:string;


    @CreateDateColumn()
    created_at: Date;
            
    
    @UpdateDateColumn()
    updated_at: Date;
            
    @DeleteDateColumn()
    deleted_at: Date;
}
