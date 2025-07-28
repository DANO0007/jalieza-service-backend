import { ServiciosCiudadano } from "src/servicios_ciudadanos/entities/servicios_ciudadano.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Ciudadanos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  last_name_father: string;

  @Column({ nullable: false })
  last_name_mother: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({ nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  marital_status: string;

  @ManyToOne(() => Ciudadanos, citizen => citizen.partners, { nullable: true })
  @JoinColumn({ name: 'partner_id' })
  partner: Ciudadanos;

  @OneToMany(() => Ciudadanos, citizen => citizen.partner, { nullable: true })
  partners: Ciudadanos[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => ServiciosCiudadano, service => service.citizen)
  services: ServiciosCiudadano[];
}
