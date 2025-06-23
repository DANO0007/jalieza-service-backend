import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CatalogoServicio } from './../../catalogo_servicios/entities/catalogo_servicio.entity';

@Entity()
export class CatalogoOrden {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  order_name: string;

  @Column({ nullable: false })
  required_points: number;

  @OneToMany(() => CatalogoServicio, servicio => servicio.order)
  services: CatalogoServicio[];
}
