import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {CustomerPhone} from "./customerPhone";
import {Instance} from "./instance";
import {User} from "./user";

@Entity({name: "customers"})
export class Customer extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public code: number;

    @Column({ type: "enum", enum: ["NATURAL", "JURIDICAL"] })
    public type: string;

    @Column({ type: "enum", enum: ["ACTIVE", "INACTIVE"] })
    public status: string;

    @Column()
    public name: string;

    @Column({ nullable: true })
    public notes: string;

    @Column({ nullable: true })
    public document: string;

    @Column({ nullable: true })
    public streetName: string;

    @Column({ nullable: true })
    public streetNumber: string;

    @Column({ nullable: true })
    public complementary: string;

    @Column({ nullable: true })
    public neighborhood: string;

    @Column({ nullable: true })
    public city: string;

    @Column({ nullable: true })
    public zipcode: string;

    @Column({ nullable: true })
    public state: string;

    @Column()
    public createdAt: Date;

    @Column({ nullable: true })
    public updatedAt: Date;

    @Column({ nullable: true })
    public deletedAt: Date;

    @Column()
    public instanceId: number;

    @Column()
    public userId: number;

    @ManyToOne((type) => Instance)
    @JoinColumn({ name: "instance_id" })
    public instance?: Instance;

    @ManyToOne((type) => User)
    @JoinColumn({ name: "user_id" })
    public user?: User;

    @OneToMany((type) => CustomerPhone, (phone) => phone.customer)
    public phones: CustomerPhone[];
}
