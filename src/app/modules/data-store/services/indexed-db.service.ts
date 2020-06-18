import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DBTableNamesModel, DBTableNamesType } from '../models/DB-table-names.model';

@Injectable()
export class IndexedDBService {
  private indexedDB: IDBFactory;
  private readonly nameDB = 'my-pwa-store';
  private readonly notificationTableName: DBTableNamesType = DBTableNamesModel.notification;

  constructor() {
    this.indexedDB = window.indexedDB;
    this.checkTableExist(this.notificationTableName);
  }

  public checkTableExist(tableName: DBTableNamesType) {
    this.openDB(tableName).subscribe((db: any) => {
      console.log(db.objectStoreNames, db.objectStoreNames.contains(tableName));
    });
  }

  public openDB(tableName?: DBTableNamesType) {
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

        this.migrationHandler(ev, tableName);
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
          observer.next();
          observer.complete();
        };

        request.onerror = () => {
          console.log('transaction error', request.error);
        };
      });
    });
  }

  public getAll<T>(tableName: DBTableNamesType): Observable<T> {
    return new Observable((observer: any) => {
      this.openDB().subscribe((db: any) => {
        const transaction = db.transaction(tableName, 'readonly');
        const store = transaction.objectStore(tableName);
        const request = store.getAll();

        request.onsuccess = () => {
          observer.next(request.result);
          observer.complete();
        };

        request.onerror = () => {
          console.log('transaction error', request.error);
        };
      });
    });
  }

  private migrationHandler({oldVersion, newVersion}: IDBVersionChangeEvent, tableName: DBTableNamesType) {
    if (oldVersion === newVersion) {
      return;
    }

    // Migration logic from oldVersion to newVersion
  }
}
