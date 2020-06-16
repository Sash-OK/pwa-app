import { Injectable, OnDestroy } from '@angular/core';
import { NotificationModel } from '../models/notification.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreDriverService } from '../../data-store/services/store-driver.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class UserNotificationService implements OnDestroy {
  public loading$ = new BehaviorSubject(null);
  public notifications$ = new BehaviorSubject([]);

  private readonly isAPISupported: boolean;
  private hasPermission$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private storeSrv: StoreDriverService) {
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

  public fetchNotifications() {
    this.getList().subscribe((data: NotificationModel[]) => {
      this.notifications$.next(data);
    });
  }

  public getList(): Observable<NotificationModel[]> {
    this.startLoading();
    return this.storeSrv.getNotifications()
      .pipe(finalize(this.finishLoading.bind(this)));
  }

  public add(message: NotificationModel) {
    this.startLoading();
    this.storeSrv.addNotification(message)
      .pipe(finalize(this.finishLoading.bind(this)))
      .subscribe(this.fetchNotifications.bind(this));
  }

  public ngOnDestroy() {
    this.hasPermission$.complete();
    this.loading$.next(null);
    this.loading$.complete();
  }

  private startLoading() {
    this.loading$.next(true);
  }

  private finishLoading() {
    this.loading$.next(null);
  }
}
