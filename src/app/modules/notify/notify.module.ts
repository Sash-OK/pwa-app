import { ModuleWithProviders, NgModule } from '@angular/core';
import { UserNotificationService } from './services/user-notification.service';

@NgModule({
  declarations: [],
  imports: []
})
export class NotifyModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NotifyModule,
      providers: [
        UserNotificationService
      ]
    };
  }
}
