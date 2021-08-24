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

      // TODO: crear pdf, y luego adjuntar para envio, ver donde se puede hacer mejor,, 
      //       este servicio se ejecuta al finalizar la consulta, entonces
      //       1. se crea el PDF
      //          creoque aqui meter un await que ejecuta la generacion,, luego ajuntar segun path generado
      //       2. se envia por mail
      //       3. se elimina el PDF del sistema, 
      //          (para que guardarlo ? solo me va a ocupar mas espacio, 
      //          y solo lo necesito para enviar el mail,,, puedo mostrar la info mas bonita con solo con los datos )

      const info = await this.transporter.sendMail({
        from: '"Dr. David Ochoa"  <doctor@tuhospitalvirtual.com>', // sender address
        to: 'brayad@gmail.com, bochoa@acid.cl, doctor@tuhospitalvirtual.com', // list of receivers
        subject: '📋 Informe clínico de Maria Ferrer 6', // Subject line
        text: 'Hola Maria, adjunto el informe clínico de la consulta del 3 de agosto del 2021', // plain text body
        html: 'Hola Maria, adjunto el <b>informe clínico</b> de la consulta del 3 de agosto del 2021', // html body
        attachments: [
          {
            path: './medical-report.pdf',
          },
        ],
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
