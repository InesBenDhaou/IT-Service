import { Controller, Get, Param, Patch, Post, Body ,Delete, Req, UseGuards} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getNotifications(@Req() req): Promise<Notification[]> {
    return this.notificationService.getNotificationsForUser(req.user.email);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: number): Promise<void> {
    return this.notificationService.markAsRead(id);
  }

  @Post()
  async createNotification(@Body() createNotificationDto: { email: string, message: string ,url:string }): Promise<Notification> {
    const { email, message,url } = createNotificationDto;
    return this.notificationService.createNotification(email, message,url);
  }

  @Delete()
  async deleteAllNotifications(): Promise<void> {
    return this.notificationService.deleteAllNotifications();
  }
}
