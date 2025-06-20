import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import {CatalogoOrden} from './../../catalogo_orden/entities/catalogo_orden.entity'
@Entity()
export class CatalogoServicio {
    @Column({primary:true, generated: true})
    id:number;

    @Column( { nullable:false})
    nombre_servicio:string;

   @ManyToOne(() => CatalogoOrden, orden => orden.servicios, { onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'orden_id' })
  orden: CatalogoOrden;
    @Column( { nullable:false})
    descripcion:string;


    @CreateDateColumn()
    created_at: Date;
            
    
    @UpdateDateColumn()
    updated_at: Date;
            
    @DeleteDateColumn()
    deleted_at: Date;
}
