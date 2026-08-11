import { BaseEntity } from '@core/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FieldType } from '../enums/field-type.enum';
import { User } from '../../users/entities/user.entity';

@Entity('custom_fields')
export class CustomField extends BaseEntity {
  @Column()
  name: string;

  @Column()
  key: string;

  @Column({ type: 'enum', enum: FieldType, default: FieldType.TEXT })
  type: FieldType;

  @ManyToOne(() => User, (user) => user.customFields, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
