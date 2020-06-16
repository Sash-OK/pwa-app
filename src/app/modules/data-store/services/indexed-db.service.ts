import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DBTableNamesModel, DBTableNamesType } from '../models/DB-table-names.model';
import { NotificationModel } from '../../notification/models/notification.model';

@Injectable()
export class IndexedDBService {
  public db: IDBDatabase;
  private indexedDB: IDBFactory;
  private readonly nameDB = 'my-pwa-store';
  private readonly notificationTableName: DBTableNamesType = DBTableNamesModel.notification;

  constructor() {
    this.indexedDB = window.indexedDB;
    this.checkTableExist(this.notificationTableName);
  }

  public checkTableExist(tableName: string) {
    this.openDB(tableName).subscribe((db: any) => {
      console.log(db.objectStoreNames, db.objectStoreNames.contains(tableName));
    });
  }

  public openDB(tableName?: string) {
    return new Observable((observer: any) => {
      const request: IDBOpenDBRequest = this.indexedDB.open(this.nameDB);

      request.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
        const db = request.result;

        if (!db.objectStoreNames.contains(tableName)) {
          db.createObjectStore(tableName, {
            keyPath: 'temporaryID',
            autoIncrement: true
          });
        }
      };

      request.onsuccess = () => {
        const db = request.result;

        db.onversionchange = () => {
          db.close();
          console.log('Refresh the page, DB is outdated');
        };

        observer.next(request.result);
        observer.complete();
      };
      request.onerror = (ev) => console.log(ev);
    });
  }

  public post(data: any, tableName: DBTableNamesType): Observable<any> {
    return new Observable((observer: any) => {
      this.openDB().subscribe((db: any) => {
        const transaction = db.transaction(tableName, 'readwrite');
        const store = transaction.objectStore(tableName);
        const request = store.add(data);

        request.onsuccess = () => {
          observer.next({...data, id: request.result});
          observer.complete();
        };

        request.onerror = () => {
          console.log('transaction onerror', request.error);
        };
      });
    });
  }
}
