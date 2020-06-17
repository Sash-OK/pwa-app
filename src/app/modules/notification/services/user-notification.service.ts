import { Injectable, OnDestroy } from '@angular/core';
import { NotificationModel } from '../models/notification.model';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { StoreDriverService } from '../../data-store/services/store-driver.service';
import { catchError, finalize } from 'rxjs/operators';
import { MySwService } from './my-sw.service';
import { NotificationApiService } from './notification-api.service';

@Injectable()
export class UserNotificationService implements OnDestroy {
  public loading$ = new BehaviorSubject(null);
  public serverNotifications$ = new BehaviorSubject([]);
  public localNotifications$ = new BehaviorSubject([]);

  private readonly isAPISupported: boolean;
  private hasPermission$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private storeSrv: StoreDriverService,
    private sw: MySwService,
    private serverAPI: NotificationApiService
  ) {
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
    this.getListFromServer().subscribe((data: NotificationModel[]) => {
      this.serverNotifications$.next(data);
    });
  }

  public fetchLocalNotifications() {
    this.getListFromStore().subscribe((data: NotificationModel[]) => {
      this.localNotifications$.next(data);
    });
  }

  public getListFromStore(): Observable<NotificationModel[]> {
    return this.storeSrv.getNotifications();
  }

  public getListFromServer(): Observable<NotificationModel[]> {
    this.startLoading();
    return this.serverAPI.getNotifications()
      .pipe(finalize(this.finishLoading.bind(this)));
  }

  public add(notification: NotificationModel) {
    this.startLoading();
    this.serverAPI.addNotification(notification)
      .pipe(
        finalize(this.finishLoading.bind(this)),
        catchError((error) => {
          this.storeSrv.addNotification(notification).subscribe(
            () => {
              this.fetchLocalNotifications();
              this.sw.initSync();
            }
          );


          return throwError(error);
        })
      )
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
