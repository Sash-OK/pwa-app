import { Component, Input } from '@angular/core';
import { NotificationModel } from '../../models/notification.model';

@Component({
  selector: 'app-notification-list-item',
  templateUrl: './notification-list-item.component.html',
  styleUrls: ['./notification-list-item.component.css']
})
export class NotificationListItemComponent {
  @Input() public item: NotificationModel;
}
