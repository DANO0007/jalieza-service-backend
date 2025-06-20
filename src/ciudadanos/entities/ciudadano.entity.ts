import { ServiciosCiudadano } from "src/servicios_ciudadanos/entities/servicios_ciudadano.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";

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

     // ✅ Aquí haces la auto-relación
  @ManyToOne(() => Ciudadanos, ciudadano => ciudadano.parejas, { nullable: true })
  @JoinColumn({ name: 'pareja_id' })
  pareja: Ciudadanos;

   // ✅ Lado inverso: un ciudadano puede ser pareja de varios otros (opcional)
  @OneToMany(() => Ciudadanos, ciudadano => ciudadano.pareja,{ nullable: true })
  parejas: Ciudadanos[];


    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;
    
    @DeleteDateColumn()
    deleted_at: Date;

 @OneToMany(() => ServiciosCiudadano, servicio => servicio.ciudadano)
  servicios: ServiciosCiudadano[];



}
