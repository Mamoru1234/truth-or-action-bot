import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum ChatType {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
}

@Entity()
export class ChatSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    enum: ChatType,
    nullable: false,
  })
  type!: ChatType;

  @Column({
    nullable: false,
  })
  @Index({
    unique: true,
  })
  tgId!: string;
}
