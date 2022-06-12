import { Column, Entity, OneToOne } from 'typeorm';
import { CommonEntity } from '../../common/entity/common.entity';

@Entity('files')
export class FileEntity extends CommonEntity {
  @Column()
  name: string;

  @Column({
    type: 'text',
  })
  path: string;

  @Column({ type: 'text' })
  mimeType: string;

  @Column({ type: 'float' })
  size: number;

  // AWS Property
  @Column({ type: 'text', nullable: true })
  key: string;

  @Column({ type: 'text', nullable: true })
  url: string;
}
export class FileFillableFields {
  name: string;
  path: string;
  mimeType: string;
  size: number;
  buffer: any;
}
