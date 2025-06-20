import { Column, Entity, OneToMany } from "typeorm";
import {CatalogoServicio} from './../../catalogo_servicios/entities/catalogo_servicio.entity'

@Entity()
export class CatalogoOrden {
    @Column({primary:true, generated: true})
    id:number;

    @Column({nullable:false})
    nombre_orden:string;

    @Column({nullable:false})
    puntos_necesarios:number

    @OneToMany(() => CatalogoServicio, servicio => servicio.orden)
    servicios: CatalogoServicio[];
}
