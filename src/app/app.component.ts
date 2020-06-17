import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationModel } from './modules/notification/models/notification.model';
import { UserNotificationService } from './modules/notification/services/user-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public serverNotificationsList$: Observable<NotificationModel[]> = this.notificationSrv.serverNotifications$;
  public localNotificationsList$: Observable<NotificationModel[]> = this.notificationSrv.localNotifications$;

  constructor(private notificationSrv: UserNotificationService) {
    this.notificationSrv.fetchNotifications();
    this.notificationSrv.fetchLocalNotifications();
  }
}
