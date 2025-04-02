// notification.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from 'src/user/Entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}
  async createNotification(email: string, message: string , url:string): Promise<Notification> {
    const notification = this.notificationRepository.create({ email, message,url });
    return await this.notificationRepository.save(notification);
  }

  async getNotificationsForUser(email: string): Promise<Notification[]> {
    return await this.notificationRepository.find({ where: { email:email}, order: { timestamp: 'DESC' } });
  }

  async markAsRead(notificationId: number): Promise<void> {
    await this.notificationRepository.update(notificationId, { isRead: true });
  }

  async deleteAllNotifications(): Promise<void> {
    await this.notificationRepository.clear();
  }
}
