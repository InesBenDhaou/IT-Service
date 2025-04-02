import { Body,UploadedFile, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards ,Delete, Param, Put, UseInterceptors, HttpException, UploadedFiles, NotFoundException} from "@nestjs/common";
import { Roles } from "src/decorators/role.decorator";
import { JwtAuthGuard } from "src/jwt/jwt.guard";
import { RoleGuard } from "src/guards/role.guard";
import { DeleteResult ,UpdateResult } from "typeorm";
import { DemandeService } from "./demande.service";
import { DemandeDto, DemandePlanificateurDto } from "./DTO/demande.create.dto";
import { DemandeUpdateDto } from "./DTO/demande.update.dto";
import { Demande } from "./Entity/demande.entity";
import { GetDemandeDto } from "./DTO/demande.get.dto";
import { FileService } from "src/files/files.service";
import { getUploadConfig } from "src/utils/upload.config";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { FileEntity } from "src/files/files.entity";
import { FilesInterceptor } from '@nestjs/platform-express';
import * as mime from 'mime-types';

@Controller('demande')
export class DemandeController {
  constructor(
    private readonly demandeService: DemandeService,
    private readonly fileService: FileService
  ) {}
  
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<DemandeDto[]> {
    return this.demandeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('findRequestById/:id')
  findRequestById(@Param('id') id:number): Promise<GetDemandeDto> {
    return this.demandeService.findRequestById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("mesDemandes")
  findMyRequests(@Req() req): Promise<DemandeDto[]> {
    return this.demandeService.findMyRequests(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mesDemandesAssigner')
  async findMyRequestsAssigned(@Req() req): Promise<DemandeDto[]> {
    return this.demandeService.findMyRequestsAssigned(req.user.email);
  } 
 
  @UseGuards(JwtAuthGuard)
  @Post('createDemande')
  @UseInterceptors(FilesInterceptor('files', 10, getUploadConfig('demandes')))
  async create(
    @Body() demande: DemandeDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<DemandeDto> {
    if (files && files.length > 0) {
      const fileEntities: FileEntity[] = files.map(file => {
        const uniqueFilename = uuidv4() + path.extname(file.originalname);
        const filePath = path.join('files', 'demandes', uniqueFilename);
        fs.renameSync(file.path, filePath);
        const fileEntity = new FileEntity();
        fileEntity.originalName = file.originalname;
        fileEntity.uniqueName = uniqueFilename;
        fileEntity.path = filePath;
        return fileEntity;
      });
      try {
        await this.fileService.saveFileEntities(fileEntities);
        demande.piecesJointes = fileEntities.map(file => file.uniqueName);
      } catch (error) {
        throw new HttpException('Failed to save file information', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    return this.demandeService.create(demande);
  }

  @Get('download/:filename')
  @UseGuards(JwtAuthGuard)
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const fileEntity = await this.fileService.findByUniqueName(filename);
    if (!fileEntity) {
      throw new NotFoundException('File not found');
    }
    res.download(fileEntity.path, fileEntity.originalName);
  }

  @Get('consult/:filename')
  @UseGuards(JwtAuthGuard)
  async consultFile(@Param('filename') filename: string, @Res() res: Response) {
    const fileEntity = await this.fileService.findByUniqueName(filename);
    if (!fileEntity) {
      throw new NotFoundException('File not found');
    }

    const absolutePath = path.resolve(fileEntity.path);

    // Check if the file exists
    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundException('File not found on disk');
    }

    // Determine the MIME type
    const mimeType = mime.lookup(absolutePath);
    if (!mimeType) {
      throw new NotFoundException('Unsupported file type');
    }
    res.setHeader('Content-Type', mimeType as string);

    // Send the file
    res.sendFile(absolutePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('An error occurred while sending the file');
      }
    });
  }


  @Roles('planificateur')
  @UseGuards(JwtAuthGuard,RoleGuard)
  @Delete('deleteDemande/:id')
  delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.demandeService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateDemande/:id')
  @UseInterceptors(FilesInterceptor('files', 10, getUploadConfig('demandes')))
  async update(
    @Param('id') id: number,
    @Body() demande : DemandeUpdateDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Demande> {
    if (files && files.length > 0) {
        const fileEntities: FileEntity[] = files.map(file => {
        const uniqueFilename = uuidv4() + path.extname(file.originalname);
        const filePath = path.join('files', 'demandes', uniqueFilename);
        fs.renameSync(file.path, filePath);
        const fileEntity = new FileEntity();
        fileEntity.originalName = file.originalname;
        fileEntity.uniqueName = uniqueFilename;
        fileEntity.path = filePath;
        return fileEntity;
      });

      try {
        await this.fileService.saveFileEntities(fileEntities);
        const newFiles = fileEntities.map(file => file.uniqueName);
        demande.piecesJointes = [...demande.piecesJointes, ...newFiles];
        console.log('demande.piecesJointes :',demande.piecesJointes);
      } catch (error) {
        throw new HttpException('Failed to save file information', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    return this.demandeService.update(id, demande);
  }

}

