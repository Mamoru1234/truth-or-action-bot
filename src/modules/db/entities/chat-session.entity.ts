import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  type!: string;

  @Column()
  @Index({
    unique: true,
  })
  tgId!: string;
}
