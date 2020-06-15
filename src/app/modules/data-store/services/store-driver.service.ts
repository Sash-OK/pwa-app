import { Injectable } from '@angular/core';
import { IndexedDBService } from './indexed-db.service';
import { DBTableNamesModel } from '../models/DB-table-names.model';
import { NotificationModel } from '../../notification/models/notification.model';

@Injectable()
export class StoreDriverService {

  constructor(private db: IndexedDBService) {
  }

  public addNotification(message: NotificationModel) {
    return this.db.post(message, DBTableNamesModel.notification);
  }
}
