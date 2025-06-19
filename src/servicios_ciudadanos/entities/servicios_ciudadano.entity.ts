import { Ciudadanos } from "src/ciudadanos/entities/ciudadano.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";

export enum estadoTermino {
  completado = 'completado',
  renuncia = 'renuncia',
  expulsado = 'expulsado',
  fallecido = 'fallecido',
  traslado = 'traslado'
}
@Entity()
export class ServiciosCiudadano {

    @Column({primary:true, generated: true})
    id:number;


    @Column( { nullable:false})
    servicio_id:number;

    @Column( { nullable:false})
    fecha_inicio:Date;

    @Column( { nullable:false})
    fecha_fin: Date;

     @Column({
    nullable:false,
    type: 'enum',
    enum: estadoTermino,
    default: estadoTermino.completado, // opcional, un valor por defecto
  })
    estado_termino: estadoTermino;
    
    @Column( { nullable:false})
    observaciones:string;

    
    @CreateDateColumn()
    created_at: Date;
        
    @UpdateDateColumn()
    updated_at: Date;
        
    @DeleteDateColumn()
    deleted_at: Date;
}
