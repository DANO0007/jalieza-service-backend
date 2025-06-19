import { Column, Entity } from "typeorm";

@Entity()
export class CatalogoOrden {
    @Column({primary:true, generated: true})
    id:number;

    @Column({nullable:false})
    nombre_orden:string;

    @Column({nullable:false})
    puntos_necesarios:number
}
