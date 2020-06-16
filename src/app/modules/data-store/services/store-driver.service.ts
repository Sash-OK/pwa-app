import { Injectable } from '@angular/core';
import { NotificationModel } from '../../notification/models/notification.model';
import { Observable } from 'rxjs';
import { RequestHandlerService } from '../../request/services/request-handler.service';

@Injectable()
export class StoreDriverService {

  constructor(private request: RequestHandlerService) {
  }

  public addNotification(message: NotificationModel): Observable<NotificationModel> {
    return this.request.to('notifications_111').post<NotificationModel>(message);
  }

  public getNotifications(): Observable<NotificationModel[]> {
    return this.request.to('notifications').get<NotificationModel[]>();
  }
}
