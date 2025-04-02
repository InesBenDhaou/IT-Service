import { Component } from 'src/demande/Composants/Entity/component.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';



@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable : true})
  categoryImg : string ;

  // One category can have many components
  @OneToMany(() => Component, component => component.category)
  components: Component[];

}
