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
import { GenderType } from 'src/users/enum/gender.enum';
import 'moment/locale/es';
import * as moment from 'moment';
import { ConsultationsStatus } from 'src/consultations/enum/consultations-status.enum';
import { IQuote } from 'src/shared/interfaces/consultations.interfaces';

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

  async getReportByConsultationId(consultationId: string, res: any) {
    const consultation = await this.consultationsServive.findOne(
      consultationId,
    );

    console.log(`consultation`, consultation);

    let html = fs.readFileSync('./report.html', 'utf8');

    // PATIENT
    html = html.replace('{{patientDni}}', consultation.patient.dni);
    html = html.replace(
      '{{patientName}}',
      `${consultation.patient.firstName} ${consultation.patient.lastName}`,
    );
    html = html.replace(
      '{{patientGender}}',
      consultation.patient.gender === GenderType.FELAME
        ? 'Femenino'
        : 'Masculino',
    );
    html = html.replace(
      '{{patientBirthDate}}',
      moment(consultation.patient.birthDate).format('D [de] MMMM [del] YYYY'),
    );

    // DOCTOR
    html = html.replace(
      '{{doctorName}}',
      `${consultation.doctor.firstName} ${consultation.doctor.lastName}`,
    );
    html = html.replace(
      '{{doctorCollegiateNumber}}',
      consultation.doctorDetail.collegiate_number,
    );
    html = html.replace(
      '{{doctorSpecialty}}',
      consultation.doctorDetail.specialty,
    );

    // CONSULTATION
    html = html.replace(
      '{{consultationDate}}',
      moment(consultation.date).format('D [de] MMMM [del] YYYY'),
    );

    if (consultation.status === ConsultationsStatus.ATTENDED) {
      const observations: string[] = JSON.parse(consultation.observations);

      if (observations.length === 0) {
        html = html.replace('{{consultationDiagnosis}}', 'No indicó');
      } else if (observations.length === 2) {
        html = html.replace(
          '{{consultationDiagnosis}}',
          `
          <div style="font-weight: bold">CIE-10</div>
          <div style="padding-left: 10">
            ${observations[0]}
          </div>
          <hr />
          <strong>Observaciones</strong>
          <div style="padding-left: 10">
          ${observations[1]}
          </div>
          `,
        );
      } else if (observations.length === 1) {
        html = html.replace(
          '{{consultationDiagnosis}}',
          `
          <strong>Observaciones</strong>
          <div style="padding-left: 10">
          ${observations[1]}
          </div>
          `,
        );
      }

      const prescriptions: string[] = JSON.parse(consultation.prescriptions);
      if (prescriptions.length > 0) {
        let prescriptionsHTML = '';
        prescriptions.forEach((prescription) => {
          prescriptionsHTML += `<div>${prescription}</div><hr />`;
        });
        html = html.replace(
          '{{consultationPrescription}}',
          prescriptionsHTML.slice(0, prescriptionsHTML.length - 6),
        );
      } else {
        html = html.replace('{{consultationPrescription}}', 'No indicó');
      }

      const exams: string[] = JSON.parse(consultation.exams);
      if (exams.length > 0) {
        let examsHTML = '';
        exams.forEach((exam) => {
          examsHTML += `<div>${exam}</div><hr />`;
        });
        html = html.replace(
          '{{consultationExams}}',
          examsHTML.slice(0, examsHTML.length - 6),
        );
      } else {
        html = html.replace('{{consultationExams}}', 'No indicó');
      }

      const quote: IQuote[] = JSON.parse(consultation.quote);
      if (quote.length > 0) {
        let quoteHTML = `
      <table>
        <tr>
          <th style="padding-top: 0px">Servicio</th>
          <th style="padding-top: 0px">Costo</th>
        </tr>
        {{quoteList}}
      </table>
      `;
        let quoteList = '';
        quote.forEach((quote) => {
          quoteList += `
        <tr>
          <td>${quote.service}</td>
          <td>${quote.cost}</td>
        </tr>
        `;
        });
        quoteHTML = quoteHTML.replace('{{quoteList}}', quoteList);
        html = html.replace('{{consultationQuote}}', quoteHTML);
      } else {
        html = html.replace('{{consultationQuote}}', 'No indicó');
      }
    }

    html = html.replace('{{consultationId}}', consultation.id);

    const options: htmlPDF.CreateOptions = {
      format: 'Letter',
      type: 'pdf',
      border: {
        top: '0mm',
        right: '7mm',
        bottom: '7mm',
        left: '7mm',
      },
      paginationOffset: 1, // Override the initial pagination number
      header: {
        height: '7mm',
        contents:
          '<div style="text-align: right; vertical-align: top;"><small>tuhospitalvirtual.com &nbsp; doctorapp.io</small></div>',
      },
      footer: {
        height: '7mm',
        contents: {
          // first: 'Cover page',
          // 2: 'Second page', // Any page number is working. 1-based index
          default: `<div style="display: inline-block; width: 73mm;"><span style="color: #444;">{{page}}</span>/<span>{{pages}}</span></div> 
                    <div style="display: inline-block; width: 73mm; text-align: right;">${consultation.id}</div>`, // fallback value
          // last: 'Last Page',
        },
      },
    };

    htmlPDF.create(html, options).toStream((err, stream) => {
      if (err) return res.end(err.stack);
      res.setHeader('Content-type', 'application/pdf');
      stream.pipe(res);
    });

    htmlPDF
      .create(html, options)
      .toFile('./consultation-report.pdf', function (err, res) {
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
