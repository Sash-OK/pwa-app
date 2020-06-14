import { NgModule } from '@angular/core';
import { UserNotificationService } from './services/user-notification.service';
import { DataStoreModule } from '../data-store/data-store.module';
import { CreateNotificationComponent } from './components/create-notification/create-notification.component';
import { NotificationsListComponent } from './components/notifications-list/notifications-list.component';
import { NotificationListItemComponent } from './components/notification-list-item/notification-list-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    CreateNotificationComponent,
    NotificationsListComponent,
    NotificationListItemComponent
  ],
  imports: [
    DataStoreModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    CreateNotificationComponent,
    NotificationsListComponent
  ],
  providers: [
    UserNotificationService
  ]
})
export class MyNotificationModule {}
