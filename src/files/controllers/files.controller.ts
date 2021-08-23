import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  // StreamableFile,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs';
import * as path from 'path';
import { CreateFilesDto } from '../dto/CreateFilesDto';
import { FilesService } from '../services/files.service';

@Controller('files')
// @UseGuards(AuthGuard('jwt'))
export class FilesController {
  logger = new Logger();

  constructor(private readonly filesService: FilesService) {}

  @Post()
  async uploadFilesToDirectory(@Body() files: CreateFilesDto) {
    return await this.filesService.uploadFilesToDirectory(files);
  }

  @Get('consultations/:id')
  async getAttachedFilesByConsultationId(@Param('id') consultationId: string) {
    return await this.filesService.getAttachedFilesByConsultationId(
      consultationId,
    );
  }

  @Get(':fileName')
  getFile(@Res() res, @Param('fileName') fileName: string) {
    const path_ = path.join(__dirname, `../../../public/${fileName}`);

    if (!fs.existsSync(path_)) {
      throw new NotFoundException('File not found');
    }

    res.sendFile(path_);
  }
  @Get('consultations/:id/report')
  async getReportByConsultationId(@Param('id') consultationId: string) {
    return await this.filesService.getReportByConsultationId(
      consultationId,
    );
  }
}

// convertir en imagen
// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAA..
