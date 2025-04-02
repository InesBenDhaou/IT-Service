import { Body, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"; 
import { DeleteResult, Repository ,UpdateResult } from "typeorm";
import { UserService } from "src/user/user.service";
import { MailerService } from "src/mailer/mailer.service";
import { User } from "src/user/Entity/user.entity";
import { Knowledgebase } from "./Entity/knowledgebase.entity";
import { KnowledgeDTO ,KnowledgeTechnicienDTO } from "./DTO/knowledgecreate.dto";
import { KnowledgebaseUpdateDTO } from "./DTO/knowledgeupdate.dto";

@Injectable()
export class KnowledgebaseService {

  constructor(
    @InjectRepository(Knowledgebase)
    private knowledgebaseRepository: Repository<Knowledgebase>,
    private readonly mailerservice: MailerService,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Knowledgebase[]> {
    return this.knowledgebaseRepository.find({
        order: {
            isConfirmed: 'ASC',
            added_at: 'DESC',
        },
    });
  }

  async findNoneConfirmed () : Promise<Knowledgebase[]> {
    return this.knowledgebaseRepository.find({where : {isConfirmed: false}});
  }

  async findConfirmed () : Promise<Knowledgebase[]> {
    return this.knowledgebaseRepository.find({where : {isConfirmed: true}});
  }


  async findOne (id:number) :Promise<Knowledgebase>{
    return this.knowledgebaseRepository.findOne({where : {id}});
  }

  async create(knowledge: KnowledgeDTO): Promise<KnowledgeDTO> {  
    return this.knowledgebaseRepository.save(knowledge);
  }

  async createByTechnicien(knowledge: KnowledgeTechnicienDTO): Promise<Knowledgebase> {
    const newknowledge = await this.knowledgebaseRepository.save(knowledge);
    const planificateur: User = await this.userService.findPlanificateur();
    if (!planificateur) {
      throw new NotFoundException('Planificateur not found');
    }
    this.mailerservice.sendNotificationEmail({
      name: planificateur.userLastName,
      email: planificateur.email,
      message: `Un technicien a proposé un nouveau ${newknowledge.type} pour la base de connaissances`,
      url:`/basedeconnaissance/${newknowledge.id}`
    });
    return newknowledge;
  }

  async delete(id: number): Promise<DeleteResult> {
    const knowledgebase = await this.knowledgebaseRepository.findOne({ where: { id } });
    if (!knowledgebase) {
      throw new NotFoundException('Knowledgebase not found');
    }
  
    const result = await this.knowledgebaseRepository.delete(id);
    if (!result.affected) {
      throw new ForbiddenException('You do not have permission to delete this tuto.');
    }
  
    const technicien = await this.userService.findOne(knowledgebase.createrId);
    if (!technicien) {
      throw new NotFoundException('Technicien not found');
    }
  
    this.mailerservice.sendNotificationEmail({
      name: technicien.userLastName,
      email: technicien.email,
      message: `Un ${knowledgebase.type} que vous avez proposé précédemment a été supprimé`,
      url:`/basedeconnaissance`
    });
  
    return result;
  }
  

  
  async deleteAll(): Promise<DeleteResult> {
    const result = await this.knowledgebaseRepository.delete({});
    if (!result.affected) {
      throw new ForbiddenException('You do not have permission to delete all Articles.');
    }
    return result;
  }

  async update (id: number , knowledge:KnowledgebaseUpdateDTO): Promise<Knowledgebase> {  
    this.knowledgebaseRepository.update(id, knowledge);
    return this.knowledgebaseRepository.findOne({ where: {id} });
  }

  async updateConfirmationStatus(id: number): Promise<void> {
    const knowledge = await this.knowledgebaseRepository.findOne({ where: { id } });
    if (!knowledge) {
      throw new NotFoundException('Knowledgebase not found');
    }
  
    await this.knowledgebaseRepository.update(id, { isConfirmed: true });
  
    const technicien = await this.userService.findOne(knowledge.createrId);
    if (!technicien) {
      throw new NotFoundException('Technicien not found');
    }
  
    this.mailerservice.sendNotificationEmail({
      name: technicien.userLastName,
      email: technicien.email,
      message: `Un ${knowledge.type} que vous avez proposé précédemment a été accepté`,
      url:""
    });
  }
  
  



}