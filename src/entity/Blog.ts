import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    title: string

    @Column({ type: "varchar" })
    content: string
}