import { Injectable, OnDestroy } from '@angular/core';
import { IndexedDBService } from '../../data-store/services/indexed-db.service';
import { NotificationModel } from '../models/notification.model';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class UserNotificationService implements OnDestroy {
  private readonly isAPISupported: boolean;
  private hasPermission$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public messages = [];

  constructor(private db: IndexedDBService) {
    this.isAPISupported = 'Notification' in window;
  }

  public init() {
    this.db.open('my-notifications-store', 1);
  }

  public getPermission() {
    if (Notification.permission === 'granted') {
      this.hasPermission$.next(true);
    } else {
      Notification.requestPermission((permission) => {
        console.log(permission);
        if (permission === 'granted') {
          this.hasPermission$.next(true);
        } else {
          this.hasPermission$.next(false);
        }
      });
    }
  }

  public add({message, dateTime}: NotificationModel) {
    if (this.isAPISupported) {
      this.getPermission();
    }

    const t = moment(dateTime).valueOf();
    this.messages.push(new Notification('My notify', {
      body: message,
      timestamp: t,
    }));
  }

  public ngOnDestroy() {
    this.hasPermission$.complete();
  }
}
