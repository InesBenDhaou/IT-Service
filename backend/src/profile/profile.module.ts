import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/Entity/user.entity';


@Module({
      imports : [
            TypeOrmModule.forFeature([User]),
      ],
      providers :[ProfileService],
      controllers: [ProfileController]
})
export class ProfileModule {}
