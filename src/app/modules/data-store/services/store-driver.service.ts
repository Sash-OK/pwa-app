import { Injectable } from '@angular/core';
import { IndexedDBService } from './indexed-db.service';
import { DBTableNamesModel } from '../models/DB-table-names.model';
import { NotificationModel } from '../../notification/models/notification.model';
import { Observable } from 'rxjs';

@Injectable()
export class StoreDriverService {

  constructor(private db: IndexedDBService) {
  }

  public addNotification(message: NotificationModel): Observable<NotificationModel> {
    return this.db.post(message, DBTableNamesModel.notification);
  }
}
