import { Injectable, OnDestroy } from '@angular/core';
import { NotificationModel } from '../models/notification.model';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { StoreDriverService } from '../../data-store/services/store-driver.service';
import { MySwService } from './my-sw.service';

@Injectable()
export class UserNotificationService implements OnDestroy {
  private readonly isAPISupported: boolean;
  private hasPermission$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private storeSrv: StoreDriverService, private sw: MySwService) {
    this.isAPISupported = 'Notification' in window;
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

  public add(message: NotificationModel) {
    return this.storeSrv.addNotification({...message}).subscribe((data) => {
      this.sw.showNotification(data);
    });
    /*if (this.isAPISupported) {
      this.getPermission();
    }

    const t = moment(dateTime).valueOf();
    this.messages.push(new Notification('My notify', {
      body: message,
      timestamp: t
    }));*/
  }

  public ngOnDestroy() {
    this.hasPermission$.complete();
  }
}
