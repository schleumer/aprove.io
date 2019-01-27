import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Customer} from "./customer";

@Entity({name: "customer_phones"})
export class CustomerPhone extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public customerId: number;

    @Column()
    public position: number;

    @Column()
    public phone: string;

    @ManyToOne((type) => Customer)
    @JoinColumn({ name: "customer_id" })
    public customer?: Customer;
}
