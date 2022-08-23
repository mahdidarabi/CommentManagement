import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn('increment')
  public id!: number;

  @Column({ type: 'int' })
  public userId: number;

  @Column({ type: 'int' })
  public refId: number;

  @Column({ type: 'varchar', length: 120 })
  public refType: 'post' | 'comment';

  @DeleteDateColumn()
  public deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
