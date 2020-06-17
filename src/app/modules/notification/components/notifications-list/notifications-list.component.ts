import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationModel } from '../../models/notification.model';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsListComponent {
  @Input() public list: NotificationModel[];
  @Input() public heading: string;
}
