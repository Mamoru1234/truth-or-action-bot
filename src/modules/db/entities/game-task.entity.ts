import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum GameTaskType {
  Truth = 'T',
  Action = 'A',
}

@Entity()
export class GameTaskEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    nullable: false,
    enum: GameTaskType,
  })
  type!: GameTaskType;

  @Column({
    nullable: false,
  })
  text!: string;
}
