import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { IEmailConsultationAttended } from 'src/shared/interfaces/emails.interfaces';
import { GenderType } from 'src/users/enum/gender.enum';

@Injectable()
export class NotifyService {
  logger = new Logger();

  private transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: Number(process.env.SMPT_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMPT_USER_DOCTOR,
      pass: process.env.SMPT_PASS_DOCTOR,
    },
  });

  async notifyTest() {}

  async notifyConsultationAtendded(notify: IEmailConsultationAttended) {
    try {
      this.logger.log(
        `Preparing to send email | Params[${JSON.stringify(notify)}]`,
        `${NotifyService.name} | ${this.notifyConsultationAtendded.name} | BEGIN`,
      );

      let html = fs.readFileSync(
        `./public/emails/medical-report.email.html`,
        'utf8',
      );
      html = html.replace('{{patientName}}', notify.patient.firstName);
      html = html.replace('{{consultationDate}}', notify.date);

      let drTitle = 'Dr.';
      if (notify.doctor.gender === GenderType.FELAME) {
        drTitle = 'Dra.';
      }

      const info = await this.transporter.sendMail({
        from: `"${drTitle} ${notify.doctor.firstName} ${notify.doctor.lastName}"  <doctor@tuhospitalvirtual.com>`, // sender address
        to: 'brayad@gmail.com, bochoa@acid.cl, doctor@tuhospitalvirtual.com', // list of receivers
        subject: `📋 Informe clínico de ${notify.patient.firstName} ${notify.patient.lastName}`, // Subject line
        text: `Hola ${notify.patient.firstName}, adjunto el informe clínico de la consulta del ${notify.date}`, // plain text body
        html,
        attachments: [
          {
            filename: 'medical-report.pdf',
            path: `./public/consultations/reports/mr-${notify.id}.pdf`,
          },
        ],
      });

      this.logger.log(
        `Send Email OK`,
        `${NotifyService.name} | ${this.notifyConsultationAtendded.name} | END`,
      );

      fs.unlinkSync(`./public/consultations/reports/mr-${notify.id}.pdf`);
      this.logger.log(
        `Delete file mr-${notify.id}.pdf`,
        `${NotifyService.name} | ${this.notifyConsultationAtendded.name} | DELETE`,
      );
    } catch (error) {
      this.logger.error(
        `Send Email Error[${error.message}]`,
        error,
        `${NotifyService.name} | ${this.notifyConsultationAtendded.name} | END`,
      );
      // TODO: add log ERROR send email and save in trasabilitie table database
      // TODO: add logger
    }
  }
}
