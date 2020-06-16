import { Injectable } from '@angular/core';
import { RequestHandlerService } from '../../request/services/request-handler.service';
import { NotificationModel } from '../models/notification.model';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationApiService {
  constructor(private request: RequestHandlerService) {
  }

  public addNotification(message: NotificationModel): Observable<NotificationModel> {
    return this.request.to('notifications').post<NotificationModel>(message);
  }

  public getNotifications(): Observable<NotificationModel[]> {
    return this.request.to('notifications').get<NotificationModel[]>();
  }
}
