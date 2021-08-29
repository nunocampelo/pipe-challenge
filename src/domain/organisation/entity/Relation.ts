import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "./Organisation";

@Entity()
export class Relation {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  type: string

  @JoinColumn({ name: "source_id" })
  @ManyToOne(type => Organisation, Organisation => Organisation.sourceRelation,
    { cascade: false, nullable: false })
  source: Organisation

  @Index()
  @JoinColumn({ name: "target_id" })
  @ManyToOne(type => Organisation, Organisation => Organisation.targetRelation,
    { cascade: false, nullable: false })
  target: Organisation

  public static from(type: string, source: Organisation, target: Organisation) {
    const relation = new Relation()
    relation.type = type
    relation.source = source
    relation.target = target
    return relation
  }
}