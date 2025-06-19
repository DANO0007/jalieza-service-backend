import { Column, CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()
export class Rol {
    @Column({primary:true, generated: true})
    id:number;

    @Column( { nullable:false})
    nombre_rol:string;

    @CreateDateColumn()
    created_at: Date;
        
    @UpdateDateColumn()
    updated_at: Date;
        
    @DeleteDateColumn()
    deleted_at: Date;
}
