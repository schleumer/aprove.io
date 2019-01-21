import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import {Customer} from "./customer";

@Entity({name: "customer_emails"})
export class CustomerEmail extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerId: number;

    @Column()
    position: number;

    @Column()
    email: string;

    @ManyToOne(type => Customer)
    @JoinColumn({ name: "customer_id" })
    customer?: Customer;
}
