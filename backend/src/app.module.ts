import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TicketModule } from './ticket/ticket.module';
import { DemandeModule } from './demande/demande.module';
import { AuthModule } from './Auth/auth.module';
import { TokenBlacklistModule } from './Auth/BlackList/token.module';
import { ProfileModule } from './profile/profile.module';
import { CategoryModule } from './demande/Categories/category.module';
import { ComponentModule } from './demande/Composants/component.module';
import { PosteModule } from './user/Poste/poste.module';
import { DepartmentModule } from './user/Department/department.module';
import { LocalisationModule } from './user/Localisation/localisation.module';
import { MailerModule } from './mailer/mailer.module';
import { KnowledgebaseModule } from './KnowledgeBase/knowledgebase.module';
import { FileModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConfigModule.forRoot ({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as any,
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      }),
      AuthModule,
      DepartmentModule,
      PosteModule,
      LocalisationModule,
      TokenBlacklistModule,
      ProfileModule,
      UserModule ,
      PassportModule ,
      JwtModule.register({ 
        secret: process.env.JWT_SECRET, 
        signOptions: { expiresIn: '1h' } 
      }),
      TicketModule,
      DemandeModule,
      CategoryModule,
      ComponentModule ,
      KnowledgebaseModule,
      MailerModule,
      FileModule,
  ],
  controllers: [AppController],
  providers: [AppService , JwtStrategy ],
})
export class AppModule {}
