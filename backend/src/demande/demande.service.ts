import { Body, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Demande } from "./Entity/demande.entity";
import { DemandeDto, DemandePlanificateurDto } from "./DTO/demande.create.dto";
import { DemandeUpdateDto } from "./DTO/demande.update.dto";
import { MailerService } from "src/mailer/mailer.service";
import { GetDemandeDto } from "./DTO/demande.get.dto";
import { User } from "src/user/Entity/user.entity";
import { UserService } from "src/user/user.service";
import { StatusDemande } from "src/interfaces/StatusDemande";
import * as fs from 'fs';
import * as path from 'path';
import { FileService } from "src/files/files.service";

@Injectable()
export class DemandeService {

  constructor(
    @InjectRepository(Demande)
    private demandeRepository: Repository<Demande>,
    private readonly mailerservice: MailerService,
    private readonly userService: UserService,
    private readonly fileService : FileService,

  ) { }

  async findAll(): Promise<DemandeDto[]> {
    return this.demandeRepository.find({ order: { dateDemande: 'DESC' }, });
  }

  async findRequestById(id: number): Promise<GetDemandeDto> {
    return this.demandeRepository.findOne({ where: { id } })
  }

  async findMyRequests(email: string): Promise<DemandeDto[]> {
    return this.demandeRepository.find({ where: { emailBenificierDemande: email }, order: { dateDemande: 'DESC' } });
  }

  async findMyRequestsAssigned(email: string): Promise<DemandeDto[]> {
    return this.demandeRepository.find({ where: { emailTechnicienAssocie: email }, order: { dateDemande: 'DESC' } });
  }

  async create(demande: DemandeDto): Promise<DemandeDto> {
    const newdemande = this.demandeRepository.save(demande);
    const planificateur: User = await this.userService.findPlanificateur();
    if (!planificateur) {
      throw new NotFoundException('Planificateur not found');
    }
    this.mailerservice.sendNotificationEmail({ name: planificateur.userLastName, email: planificateur.email, message: "Une nouvelle demande a été créé et nécessite votre attention!", url: `/demande/${(await newdemande).id}` });
    this.mailerservice.sendNotificationEmail({ name: (await newdemande).BenificierDemande, email: (await newdemande).emailBenificierDemande, message: "Votre demande a été envoyer au planificateur avec succée", url: `/demande/${(await newdemande).id}` });
    return newdemande;
  }

  async createByPlanificateur(demande: DemandePlanificateurDto): Promise<DemandePlanificateurDto> {
    const newdemande = this.demandeRepository.save(demande);
    if ((await newdemande).technicienAssocie) {
      this.mailerservice.sendNotificationEmail({ name: (await newdemande).technicienAssocie, email: (await newdemande).emailTechnicienAssocie, message: "Une nouvelle demande a été créé et nécessite votre attention!", url: `/demande/${(await newdemande).id}` });
    }
    this.mailerservice.sendNotificationEmail({ name: (await newdemande).BenificierDemande, email: (await newdemande).emailBenificierDemande, message: "Votre demande a été envoyer au planificateur avec succée", url: `/demande/${(await newdemande).id}` });
    return newdemande;
  }

  async delete(id: number) {
    const demande = await this.demandeRepository.findOne({ where: { id } });
    const filesToDelete = demande.piecesJointes;
    if (filesToDelete && filesToDelete.length > 0) {
      filesToDelete.forEach(fileName => {
        this.fileService.deleteFileByUniqueName(fileName);
        const filePath = path.join('files', 'demandes', fileName);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath); 
          } catch (error) {
            throw new HttpException(`Failed to delete file ${fileName}`, HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
      });
    }
    const result = await this.demandeRepository.delete(id);
    if (!result.affected) {
      throw new ForbiddenException('You do not have permission to delete this demande.');
    }
    this.mailerservice.sendNotificationEmail({ name: demande.BenificierDemande, email: demande.emailBenificierDemande, message: "Votre demande avec l'identifiant " + id + " a été supprimer", url: `/demandes` });
    if (demande.technicienAssocie) {
      this.mailerservice.sendNotificationEmail({ name: demande.technicienAssocie, email: demande.emailTechnicienAssocie, message: "Une demande assigné à vous avec l'identifiant " + id + " a été supprimer", url: `/demandes` });
    }
    return result;
  }

  async update(id: number, demande: DemandeUpdateDto): Promise<Demande> {
    if (demande.statusDemande === StatusDemande.Accepter || demande.statusDemande === StatusDemande.Refuser) {
      demande.dateReponse = new Date();
    }
    this.demandeRepository.update(id, demande);
    const newdemande = await this.demandeRepository.findOne({ where: { id } });
    const planificateur: User = await this.userService.findPlanificateur();
    if (!planificateur) {
      throw new NotFoundException('Planificateur not found');
    }
    this.mailerservice.sendNotificationEmail({ name: planificateur.userLastName, email: planificateur.email, message: "la demande avec l'identifiant " + id + " a été modifié. Veuillez vérifier les détails de mise à jour", url: `/demande/${newdemande.id}` });
    this.mailerservice.sendNotificationEmail({ name: newdemande.BenificierDemande, email: newdemande.emailBenificierDemande, message: "Votre demande avec l'identifiant " + id + " a été modifié. Veuillez vérifier les détails de mise à jour", url: `/demande/${newdemande.id}` });
    if (demande.technicienAssocie) {
      this.mailerservice.sendNotificationEmail({ name: newdemande.technicienAssocie, email: newdemande.emailTechnicienAssocie, message: "Une demande assigné à vous avec l'identifiant " + id + " a été modifié. Veuillez vérifier les détails de mise à jour", url: `/demande/${newdemande.id}` });
    }
    return this.demandeRepository.findOne({ where: { id } });
  }


}