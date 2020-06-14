import { Component } from '@angular/core';
import { UserNotificationService } from './modules/notification/services/user-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private notifySrv: UserNotificationService) {
    this.notifySrv.init();
  }
}
