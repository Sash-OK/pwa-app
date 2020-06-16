import { Component } from '@angular/core';
import { UserNotificationService } from '../../services/user-notification.service';
import { Observable } from 'rxjs';
import { NotificationModel } from '../../models/notification.model';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.css']
})
export class NotificationsListComponent {
  public list$: Observable<NotificationModel[]> = this.notificationSrv.notifications$;

  constructor(private notificationSrv: UserNotificationService) {
    this.notificationSrv.fetchNotifications();
  }
}
