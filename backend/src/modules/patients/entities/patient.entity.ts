import { BaseEntity } from '@core/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('patients')
export class Patient extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  pesel: string;

  @Column({ type: 'json', nullable: true })
  customData: Record<string, any>;

  @ManyToOne(() => User, (user) => user.patients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
