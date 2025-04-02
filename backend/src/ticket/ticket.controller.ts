import { Body, HttpException, HttpStatus, Controller, Get, Post, Req, Res, UseGuards, Delete, Param, Put, UseInterceptors, UploadedFiles, NotFoundException } from "@nestjs/common";
import { Roles } from "src/decorators/role.decorator";
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from "src/jwt/jwt.guard";
import { RoleGuard } from "src/guards/role.guard";
import { DeleteResult, UpdateResult } from "typeorm";
import { TicketService } from "./ticket.service";
import { TicketDto, TicketPlanificateurDto } from "./DTO/ticket.creation.dto";
import { Ticket } from "./Entity/ticket.entity";
import {  UpdateTicketDto} from "./DTO/ticket.update.dto";
import { getUploadConfig} from "src/utils/upload.config";
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { FileService } from "src/files/files.service";
import { FileEntity } from "src/files/files.entity";
import * as mime from 'mime-types';

@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly fileService: FileService) { }

  //hedhi nesta3malha fel formulaire besh fel les champs mta3 l user infos tabda deja mawjouda par defaut


  @UseGuards(JwtAuthGuard)
  @Get('ticketById/:id')
  async getTicketById(@Param('id') id: number): Promise<Ticket> {
    return this.ticketService.findOne(id);
  }

  /***********************************************************************************************************
                                     CREATION DE TICKET 
  ***********************************************************************************************************/

  @Roles('employe', 'admin', 'technicien')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('createTicket')
  @UseInterceptors(FilesInterceptor('files', 10, getUploadConfig('tickets')))
  async create(
    @Body() ticket: TicketDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req
  ): Promise<TicketDto> {
    ticket.BenificierTicket = req.user.userLastName + " " + req.user.userName;
    ticket.emailBenificierTicket = req.user.email;
    if (files && files.length > 0) {
      const fileEntities: FileEntity[] = files.map(file => {
        const uniqueFilename = uuidv4() + path.extname(file.originalname);
        const filePath = path.join('files', 'tickets', uniqueFilename);
        fs.renameSync(file.path, filePath);
        const fileEntity = new FileEntity();
        fileEntity.originalName = file.originalname;
        fileEntity.uniqueName = uniqueFilename;
        fileEntity.path = filePath;
        return fileEntity;
      });
      try {
        await this.fileService.saveFileEntities(fileEntities);
        ticket.piecesJointes = fileEntities.map(file => file.uniqueName);
      } catch (error) {
        throw new HttpException('Failed to save file information', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    return this.ticketService.create(ticket);
  }
  @Roles('planificateur')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('createTicketByPlanificateur')
  @UseInterceptors(FilesInterceptor('files', 10, getUploadConfig('tickets')))
  async createByPlanificateur(
    @Body() ticket: TicketPlanificateurDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<TicketPlanificateurDto> {
    if (files && files.length > 0) {
      const fileEntities: FileEntity[] = files.map(file => {
        const uniqueFilename = uuidv4() + path.extname(file.originalname);
        const filePath = path.join('files', 'tickets', uniqueFilename);
        fs.renameSync(file.path, filePath);
        const fileEntity = new FileEntity();
        fileEntity.originalName = file.originalname;
        fileEntity.uniqueName = uniqueFilename;
        fileEntity.path = filePath;
        return fileEntity;
      });

      try {
        await this.fileService.saveFileEntities(fileEntities);
        ticket.piecesJointes = fileEntities.map(file => file.uniqueName);
      } catch (error) {
        throw new HttpException('Failed to save file information', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    return this.ticketService.createByPlanificateur(ticket);
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async findAll(): Promise<TicketDto[]> {
    return this.ticketService.findAll();
  }

  //hedhi trajali l'historique de tickets mte3i (user who logged in)
  @Roles('admin', 'employe', 'technicien')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('mesTickets')
  async findMyTickets(@Req() req): Promise<TicketDto[]> {
    return this.ticketService.findMyTickets(req.user.email);
  }

  //hedhi trajali l'historique de tickets mte3i en tant que technicien (eli assigner laya))
  @Roles('technicien')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('mesTicketsAssigner')
  async findMyTicketsAssigned(@Req() req): Promise<TicketDto[]> {
    return this.ticketService.findMyTicketsAssigned(req.user.email);
  }

  /***********************************************************************************************************
                                    MISE A JOUR DE TICKET 
 ***********************************************************************************************************/

  @UseGuards(JwtAuthGuard)
  @Put('updateTicket/:id')
  @UseInterceptors(FilesInterceptor('files', 10, getUploadConfig('tickets')))
  async update(
    @Param('id') id: number,
    @Body() updateTicketDto: UpdateTicketDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Ticket> {
    if (files && files.length > 0) {
        const fileEntities: FileEntity[] = files.map(file => {
        const uniqueFilename = uuidv4() + path.extname(file.originalname);
        const filePath = path.join('files', 'tickets', uniqueFilename);
        fs.renameSync(file.path, filePath);
        const fileEntity = new FileEntity();
        fileEntity.originalName = file.originalname;
        fileEntity.uniqueName = uniqueFilename;
        fileEntity.path = filePath;
        return fileEntity;
      });

      try {
        await this.fileService.saveFileEntities(fileEntities);
        // Merge existing piecesJointes with new files
        const newFiles = fileEntities.map(file => file.uniqueName);
        updateTicketDto.piecesJointes = [...updateTicketDto.piecesJointes, ...newFiles];
        console.log('updatedTicket.piecesJointes :',updateTicketDto.piecesJointes);
      } catch (error) {
        throw new HttpException('Failed to save file information', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    return this.ticketService.update(id, updateTicketDto);
  }



  /***********************************************************************************************************
                                     SUPPRISSION DE TICKET 
  ***********************************************************************************************************/

  //Une ticket peut etre supprimer
  @Roles('planificateur')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.ticketService.delete(id);
  }
}

