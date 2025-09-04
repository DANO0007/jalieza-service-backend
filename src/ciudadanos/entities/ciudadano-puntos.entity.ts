import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ciudadanos } from './ciudadano.entity';
import { CatalogoOrden } from '../../catalogo_orden/entities/catalogo_orden.entity';

@Entity()
export class CiudadanoPuntos {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ciudadanos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ciudadano_id' })
  ciudadano: Ciudadanos;

  @ManyToOne(() => CatalogoOrden)
  @JoinColumn({ name: 'orden_id' })
  orden: CatalogoOrden;

  @Column({ default: 0 })
  puntos_acumulados: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}