import { Body, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Ticket } from "./Entity/ticket.entity";
import { TicketDto, TicketPlanificateurDto } from "./DTO/ticket.creation.dto";
import { UserDto } from "src/user/DTO/user.dto";
import { UpdateTicketDto } from "./DTO/ticket.update.dto";
import { User } from "src/user/Entity/user.entity";
import { MailerService } from "src/mailer/mailer.service";
import { UserService } from "src/user/user.service";
import { StatusTicket } from "src/interfaces/StatusTicket";
import { FileService } from "src/files/files.service";
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class TicketService {

  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private readonly mailerservice: MailerService,
    private readonly userService: UserService,
    private readonly fileService : FileService,

  ) { }

  async findAll(): Promise<TicketDto[]> {
    return this.ticketRepository.find({ order: { dateCreation: 'DESC' } });
  }
  async findOne(id: number): Promise<Ticket> {
    return this.ticketRepository.findOne({ where: { id: id } })
  }

  async create(ticket: TicketDto): Promise<TicketDto> {
    const newticket = this.ticketRepository.save(ticket);
    const planificateur: User = await this.userService.findPlanificateur();
    if (!planificateur) {
      throw new NotFoundException('Planificateur not found');
    }
    this.mailerservice.sendNotificationEmail({ name: planificateur.userLastName, email: planificateur.email, message: "Un nouveau ticket a été créé et nécessite votre attention!" , url:`/ticket/${(await newticket).id}`});
    this.mailerservice.sendNotificationEmail({ name: (await newticket).BenificierTicket, email: (await newticket).emailBenificierTicket, message: "Votre Ticket a été envoyer au planificateur avec succée",url:`/ticket/${(await newticket).id}` });
    return newticket;
  }

  async createByPlanificateur(ticket: TicketPlanificateurDto): Promise<TicketPlanificateurDto> {

    const newticket = this.ticketRepository.save(ticket);
    this.mailerservice.sendNotificationEmail({ name: ticket.technicienAssocie, email: ticket.emailTechnicienAssocie, message: "Un ticket vous a été assigné et attend votre intervention pour résolution!",url:`/ticket/${(await newticket).id}` });
    this.mailerservice.sendNotificationEmail({ name: ticket.BenificierTicket, email: ticket.emailBenificierTicket, message: "Un ticket sous votre nom a été créer et assigner a un technicien!" ,url:`/ticket/${(await newticket).id}`});
    return newticket;
  }

  async findMyTickets(email: string): Promise<TicketDto[]> {
    return this.ticketRepository.find({ where: { emailBenificierTicket: email }, order: { dateCreation: 'DESC' } });
  }

  async findMyTicketsAssigned(email: string): Promise<TicketDto[]> {
    return this.ticketRepository.find({ where: { emailTechnicienAssocie: email }, order: { dateCreation: 'DESC' } });
  }

  async update(id: number, ticket: UpdateTicketDto): Promise<Ticket> {
    if (ticket.status === StatusTicket.Clôturé) {
      ticket.dateResolution = new Date(); 
    }
    const newticket = this.ticketRepository.findOne({where : {id}});
    this.ticketRepository.update(id, ticket);
    const planificateur: User = await this.userService.findPlanificateur();
    if (!planificateur) {
      throw new NotFoundException('Planificateur not found');
    }
    this.mailerservice.sendNotificationEmail({ name: planificateur.userLastName, email: planificateur.email, message: "le ticket avec l'identifiant " + id + " a été modifié. Veuillez vérifier les détails de mise à jour" ,url:`/ticket/${(await newticket).id}`});
    this.mailerservice.sendNotificationEmail({ name: ticket.BenificierTicket, email: ticket.emailBenificierTicket, message: "Votre ticket avec l'identifiant " + id + " a été modifié. Veuillez vérifier les détails de mise à jour" ,url:`/ticket/${(await newticket).id}`});
    if ((await newticket).technicienAssocie) {
    this.mailerservice.sendNotificationEmail({ name: ticket.technicienAssocie, email: ticket.emailTechnicienAssocie, message: "Une ticket assigné à vous avec l'identifiant " + id + " a été modifié. Veuillez vérifier les détails de mise à jour",url:`/ticket/${(await newticket).id}` });
  }
    return this.ticketRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<DeleteResult> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    const filesToDelete = ticket.piecesJointes;
    if (filesToDelete && filesToDelete.length > 0) {
      filesToDelete.forEach(fileName => {
        this.fileService.deleteFileByUniqueName(fileName);
        const filePath = path.join('files', 'tickets', fileName);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath); 
          } catch (error) {
            throw new HttpException(`Failed to delete file ${fileName}`, HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
      });
    }
    const result = await this.ticketRepository.delete(id);
    if (!result.affected) {
      throw new ForbiddenException('You do not have permission to delete this ticket.');
    }
    this.mailerservice.sendNotificationEmail({ name: ticket.BenificierTicket, email: ticket.emailBenificierTicket, message: "Votre ticket avec l'identifiant " + id + " a été supprimer", url: `/tickets` });
    if (ticket.technicienAssocie) {
      this.mailerservice.sendNotificationEmail({ name: ticket.technicienAssocie, email: ticket.emailTechnicienAssocie, message: "Une ticket assigné à vous avec l'identifiant " + id + " a été supprimer", url: `/tickets` });
    }
    return result;
  }

  async updateTicketPlanificateur(id: number, updateDto: any): Promise<Ticket> {
    await this.ticketRepository.update(id, updateDto);
    return this.ticketRepository.findOne({ where: { "id": id } });
  }


}