import { NgModule } from '@angular/core';
import { UserNotificationService } from './services/user-notification.service';
import { DataStoreModule } from '../data-store/data-store.module';
import { CreateNotificationComponent } from './components/create-notification/create-notification.component';
import { NotificationsListComponent } from './components/notifications-list/notifications-list.component';
import { NotificationListItemComponent } from './components/notification-list-item/notification-list-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwDriverService } from './services/sw-driver.service';
import { RequestModule } from '../request/request.module';
import { NotificationApiService } from './services/notification-api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    CreateNotificationComponent,
    NotificationsListComponent,
    NotificationListItemComponent
  ],
  imports: [
    DataStoreModule,
    ReactiveFormsModule,
    CommonModule,
    RequestModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    NgxMatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatListModule,
    MatIconModule,
  ],
  exports: [
    CreateNotificationComponent,
    NotificationsListComponent
  ],
  providers: [
    UserNotificationService,
    NotificationApiService,
    SwDriverService
  ]
})
export class MyNotificationModule {}
