import { CatalogoServicio } from "src/catalogo_servicios/entities/catalogo_servicio.entity";
import { Ciudadanos } from "src/ciudadanos/entities/ciudadano.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum TerminationStatus {
  completed = 'completado',
  resignation = 'renuncia',
  expelled = 'expulsado',
  deceased = 'fallecido',
  transfer = 'traslado',
}

@Entity()
export class ServiciosCiudadano {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ciudadanos, ciudadano => ciudadano.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ciudadano_id' })
  citizen: Ciudadanos;

  @ManyToOne(() => CatalogoServicio, { eager: true }) // Puedes poner eager: true o false
@JoinColumn({ name: 'service_id' }) // 👈 Usa el mismo nombre que el campo existente
catalogoServicio: CatalogoServicio;

  @Column({ nullable: false })
  start_date: Date;

  @Column({ nullable: false })
  end_date: Date;

  @Column({
    nullable: false,
    type: 'enum',
    enum: TerminationStatus,
    default: TerminationStatus.completed,
  })
  termination_status: TerminationStatus;

  @Column({ nullable: false })
  observations: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
