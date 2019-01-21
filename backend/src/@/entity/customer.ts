import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import {Instance} from "./instance";
import {User} from "./user";
import {CustomerPhone} from "./customerPhone";

@Entity({name: "customers"})
export class Customer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: number;

    @Column({ type: 'enum', enum: ['NATURAL', 'JURIDICAL'] })
    type: string;

    @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE'] })
    status: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    document: string;

    @Column({ nullable: true })
    streetName: string;

    @Column({ nullable: true })
    streetNumber: string;

    @Column({ nullable: true })
    complementary: string;

    @Column({ nullable: true })
    neighborhood: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    zipcode: string;

    @Column({ nullable: true })
    state: string;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;

    @Column()
    instanceId: number;

    @Column()
    userId: number;

    @ManyToOne(type => Instance)
    @JoinColumn({ name: 'instance_id' })
    instance?: Instance;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @OneToMany(type => CustomerPhone, phone => phone.customer)
    phones: CustomerPhone[]
}
