import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Instance} from "./instance";

@Entity({name: "users"})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: number;

    @Column({ type: 'enum', enum: ['ROOT', 'ADMIN', 'EXTERNAL'] })
    type: string;

    @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE'] })
    status: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;

    @ManyToOne(type => Instance, { eager: true })
    instance?: Instance;
}
