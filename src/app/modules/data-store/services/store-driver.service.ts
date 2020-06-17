import { Injectable } from '@angular/core';
import { NotificationModel } from '../../notification/models/notification.model';
import { Observable } from 'rxjs';
import { IndexedDBService } from './indexed-db.service';
import { DBTableNamesModel } from '../models/DB-table-names.model';

@Injectable()
export class StoreDriverService {

  constructor(private db: IndexedDBService) {
  }

  public addNotification(notification: NotificationModel): Observable<void> {
    return this.db.post(notification, DBTableNamesModel.notification);
  }

  public getNotifications(): Observable<NotificationModel[]> {
    return this.db.getAll<NotificationModel[]>(DBTableNamesModel.notification);
  }
}
