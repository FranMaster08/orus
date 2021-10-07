import { FilesEntity } from 'src/files/entities/files.entity';

export interface IMedicalHistory {
  doctorId: string;
  createdAt: Date;
  history: string;
  files: string[];
}
