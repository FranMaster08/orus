import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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

  async notifyConsultationAtendded() {
    try {
      this.logger.log(
        `Params[]`,
        `${NotifyService.name} | ${this.notifyConsultationAtendded.name} | BEGIN`,
      );

      const info = await this.transporter.sendMail({
        from: '"Dr. David Ochoa 3"  <doctor@tuhospitalvirtual.com>', // sender address
        to: 'brayad@gmail.com, bochoa@acid.cl, doctor@tuhospitalvirtual.com', // list of receivers
        subject: '📋 Informe clínico de Maria Ferrer', // Subject line
        text: 'Hola Maria, adjunto el informe clínico de la consulta del 3 de agosto del 2021', // plain text body
        html: 'Hola Maria, adjunto el <b>informe clínico</b> de la consulta del 3 de agosto del 2021', // html body
      });

      // console.log(`info`, info);

      // TODO: add log send email and save in trasabilitie table database

      this.logger.log(
        `Message sent`,
        `${NotifyService.name} | ${this.notifyConsultationAtendded.name} | END`,
      );
    } catch (error) {
      console.log(`error`, error);
      this.logger.error(
        error.message,
        error,
        `${NotifyService.name} | ${this.notifyConsultationAtendded.name} | END`,
      );
      // TODO: add log ERROR send email and save in trasabilitie table database
      // TODO: add logger
    }
  }
}
