import {
  BadRequestException,
  Body,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/user/Entity/user.entity';
import { GetUserDto, UpdateUserDto, UserDto } from './DTO/user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/interfaces/Role';
import { MailerService } from 'src/mailer/mailer.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerservice: MailerService,
  ) {}

  async findAll(): Promise<UserDto[]> {
    return this.userRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<GetUserDto> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUsersByRole(role: Role): Promise<User[]> {
    return this.userRepository.find({ where: { role } });
  }

  async findPlanificateur(): Promise<User> {
    return this.userRepository.findOne({ where: { role: Role.Planificateur } });
  }

  async findEmployees(employe: Role, admin: Role): Promise<User[]> {
    return this.userRepository.find({
      where: [{ role: employe }, { role: admin }],
    });
  }
  async findMail(id: number): Promise<any> {
    const user = this.userRepository.findOne({ where: { id } });
    return (await user).email;
  }

  async findManagerMail(id: number): Promise<any> {
    const user = this.userRepository.findOne({ where: { id } });
    return (await user).contactManager;
  }

  async create(user: UserDto): Promise<UserDto> {
    const IsValiduser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (IsValiduser) {
      throw new ConflictException('User already exists');
    }

    const userpassword = user.password;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const createdUser = await this.userRepository.save(user);
    await this.mailerservice.sendNewUserEmail({
      name: createdUser.userLastName,
      email: createdUser.email,
      password: userpassword,
    });
    return createdUser;
  }

  async update(id: number, user: UpdateUserDto): Promise<UpdateResult> {
    return this.userRepository.update(id, user);
  }

  async delete(id: number): Promise<DeleteResult> {
    const user = await this.userRepository.findOne({ where: { id } });
    const imagePath = path.join('images', 'profileimages', user.profileImg);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (error) {
        throw new HttpException(
          'Failed to delete image from filesystem',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
    return this.userRepository.delete(id);
  }

  async findEmailsByDepartment(
    department: string,
  ): Promise<{ email: string }[]> {
    const users = await this.userRepository.find({ where: { department } });
    return users.map((user) => ({ email: user.email }));
  }

  async findAllEmails(): Promise<{ email: string }[]> {
    const users = await this.userRepository.find();
    return users.map((user) => ({ email: user.email }));
  }

  async findUserLocalization(id: number): Promise<{ localisation: string }> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['localisation'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return { localisation: user.localisation };
  }
}
