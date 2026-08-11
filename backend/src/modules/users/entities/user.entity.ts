import { BaseEntity } from '@core/entities/base.entity';
import { UserRole } from '@core/enums/user-role.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { CustomField } from '../../custom-fields/entities/custom-field.entity';
import { UserPdfConfig } from '../../user-pdf-config/entities/user-pdf-config.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;

  @OneToMany(() => Patient, (patient) => patient.user)
  patients: Patient[];

  @OneToMany(() => CustomField, (customField) => customField.user)
  customFields: CustomField[];

  @OneToMany(() => UserPdfConfig, (pdfConfig) => pdfConfig.user)
  pdfConfigs: UserPdfConfig[];
}
