import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Usuarios } from './../../users/entities/user.entity';

@Entity()
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  role_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => Usuarios, usuario => usuario.role)
  users: Usuarios[];
}
