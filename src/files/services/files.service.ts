import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFilesDto } from '../dto/CreateFilesDto';
import { FilesEntity } from '../entities/files.entity';
import { v4 as uuidv4 } from 'uuid';
import { IFilesDB, IUrlFiles } from '../../shared/interfaces/files.interfaces';
import { FileExtension } from '../enum/files.enum';
import { ConsultationsService } from 'src/consultations/services/consultations.service';
import * as fs from 'fs';
import * as htmlPDF from 'html-pdf';

@Injectable()
export class FilesService {
  logger = new Logger();

  constructor(
    @InjectRepository(FilesEntity, 'thv-db')
    private readonly filesRepository: Repository<FilesEntity>,
    // @Inject(forwardRef(() => ConsultationsService))
    private readonly consultationsServive: ConsultationsService,
  ) {}

  async uploadFilesToDirectory(files: CreateFilesDto) {
    const FILES_URL = process.env.FILES_URL;

    try {
      const urlFiles: IUrlFiles[] = [];

      files.files.forEach((file) => {
        const base64Img = file.base64;
        const fileName = `${uuidv4()}.${file.extension}`;
        const content = Buffer.from(base64Img, 'base64');
        fs.writeFileSync(`./public/${fileName}`, content);

        urlFiles.push({
          name: fileName,
          url: `${FILES_URL}/${fileName}`,
        });

        this.logger.log(
          `Upload file ${fileName}`,
          `${FilesService.name} | ${this.uploadFilesToDirectory.name}`,
        );
      });

      this.logger.log(
        `Upload files END`,
        `${FilesService.name} | ${this.uploadFilesToDirectory.name}`,
      );

      const filesDB: string[] = urlFiles.map((file) => file.name);
      return await this.saveFiles({ ...files, files: filesDB });
    } catch (error) {
      this.logger.error(
        `Error[${error.message}]`,
        error,
        `${FilesService.name} | ${this.uploadFilesToDirectory.name}`,
      );
      throw new ConflictException('Error loading file');
    }
  }

  private async saveFiles(files: IFilesDB): Promise<FilesEntity> {
    // TODO: verificar si existe doctor
    // TODO: verificar si existe pati
    // TODO: verificar si existe consultation

    let newFiles = new FilesEntity();
    newFiles.patientId = files.patientId;
    newFiles.doctorId = files.doctorId;
    newFiles.context = files.context;
    newFiles.consultationId = files.consultationId;
    newFiles.files = JSON.stringify(files.files);

    const saveFiles = await this.filesRepository.save(newFiles);

    this.logger.log(
      `Return[${JSON.stringify(saveFiles)}]`,
      `${FilesService.name} | ${this.saveFiles.name}`,
    );
    return saveFiles;
  }

  async getAttachedFilesByConsultationId(consultationId: string) {
    const findAttachedFiles = await this.filesRepository.findOne({
      where: { consultationId },
    });

    if (!findAttachedFiles) {
      throw new NotFoundException('Consultation not found');
    }

    const attachedFiles: { images: string[]; pdfs: string[] } = {
      images: [],
      pdfs: [],
    };

    JSON.parse(findAttachedFiles.files).forEach((attached: string) => {
      if (attached.includes(FileExtension.PDF)) {
        attachedFiles.pdfs.push(attached);
      } else if (
        attached.includes(FileExtension.PNG) ||
        attached.includes(FileExtension.JPEG)
      ) {
        attachedFiles.images.push(attached);
      }
      return attached;
    });

    return attachedFiles;
  }

  async getReportByConsultationId(consultationId: string) {
    const consultation = await this.consultationsServive.findOne(
      consultationId,
    );

    const html = fs.readFileSync('./report.html', 'utf8');
    const options: htmlPDF.CreateOptions = { format: 'Letter' };

    htmlPDF.create(html, options).toFile('./foo2.pdf', function (err, res) {
      if (err) return console.log(err);
      console.log(res); // { filename: '/app/businesscard.pdf' }
    });

    // htmlPDF.create(html).toStream(function (err, stream) {
    //   stream.pipe(fs.createWriteStream('./foo2.pdf'));
    // });

    // htmlPDF.create(html).toBuffer(function(err, buffer){
    //   console.log('This is a buffer:', Buffer.isBuffer(buffer));
    // });

    return 1;
  }
}
