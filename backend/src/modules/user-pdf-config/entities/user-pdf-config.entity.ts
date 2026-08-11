import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '@core/entities/base.entity';

@Entity('user_pdf_configs')
export class UserPdfConfig extends BaseEntity {
  @Column({ default: 'Domyślny Raport' })
  reportTitle: string;

  @Column({ type: 'json' })
  selectedStandardFields: string[];

  @Column({ type: 'json' })
  selectedCustomFieldKeys: string[];

  @ManyToOne(() => User, (user) => user.pdfConfigs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
