import { Column, Entity, Index, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Relation } from "./Relation";

@Entity()
export class Organisation {

  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column({ unique: true })
  name: string

  @OneToMany(type => Relation, relation => relation.source, {
    cascade: false,
  })
  sourceRelation: Relation[]

  @OneToMany(type => Relation, relation => relation.target, {
    cascade: false,
  })
  targetRelation: Relation[]

  addParentRelations(parentOrg: Organisation) {
    const parentRelationship: Relation = Relation.from('parent', parentOrg, this)
    const daughterRelationship: Relation = Relation.from('daughter', this, parentOrg)

    parentOrg.sourceRelation.push(parentRelationship)
    parentOrg.targetRelation.push(daughterRelationship)

    this.sourceRelation.push(daughterRelationship)
    this.targetRelation.push(parentRelationship)
  }

  addSisterRelations(sisterOrg: Organisation) {

    const sisterRelationship: Relation = Relation.from('sister', this, sisterOrg)
    const sisterInverseRelationship: Relation = Relation.from('sister', sisterOrg, this)

    this.sourceRelation.push(sisterRelationship)
    this.targetRelation.push(sisterInverseRelationship)

    sisterOrg.sourceRelation.push(sisterInverseRelationship)
    sisterOrg.targetRelation.push(sisterRelationship)
  }

  public static from(name: string) {
    const org = new Organisation()
    org.name = name
    org.sourceRelation = []
    org.targetRelation = []
    return org
  }

}