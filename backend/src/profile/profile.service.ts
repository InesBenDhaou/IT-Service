import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/Entity/user.entity";
import { Repository } from "typeorm";
import { ProfileDto } from "./DTO/profile.dto";
import { UpdateProfileDTO } from "./DTO/profile.update.dto";





@Injectable()
export class ProfileService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

  ) {}

  async update (id:number, updatedto:UpdateProfileDTO) :Promise<ProfileDto> {
    await this.userRepository.update(id, updatedto);
    return this.userRepository.findOne({where:{"id":id}});
  }


  async updateUserProfile(userId: number, updateDto: any): Promise<User> {
    await this.userRepository.update(userId, updateDto);
    return this.userRepository.findOne({where:{"id":userId}});
  }

  async updateUser(userId: number, updateDto: any): Promise<User> {
    await this.userRepository.update(userId, updateDto);
    return this.userRepository.findOne({where:{"id":userId}});
  }

  

  
}