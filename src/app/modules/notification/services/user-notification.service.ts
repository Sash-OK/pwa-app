import { Injectable, OnDestroy } from '@angular/core';
import { NotificationModel } from '../models/notification.model';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { StoreDriverService } from '../../data-store/services/store-driver.service';
import { catchError, delay, filter, finalize, tap } from 'rxjs/operators';
import { SwDriverService } from '../../my-sw/services/sw-driver.service';
import { NotificationApiService } from './notification-api.service';
import { NotificationAdapter } from '../utils/notification-adapter';
import * as moment from 'moment';

@Injectable()
export class UserNotificationService implements OnDestroy {
  public loading$ = new BehaviorSubject(null);
  public serverNotifications$ = new BehaviorSubject([]);
  public localNotifications$ = new BehaviorSubject([]);

  private readonly isAPISupported: boolean;
  private readonly syncNotificationsEventName = 'syncPostNotification';
  private hasPermission$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private storeSrv: StoreDriverService,
    private sw: SwDriverService,
    private serverAPI: NotificationApiService
  ) {
    this.isAPISupported = 'Notification' in window;

    this.sw.messages$.pipe(
      filter((ev: MessageEvent) => ev.data.type === this.syncNotificationsEventName)
    ).subscribe(() => this.updateLists());
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

  public showNotification(notification: NotificationModel) {
    this.sw.notification().pipe(
      delay(moment(notification.dateTime).valueOf() - moment.now().valueOf())
    ).subscribe((dn) => {
      dn.withOptions(NotificationAdapter.getSimple(notification))
        .show().subscribe(() => console.log('Message should be visible', notification));
    });
  }

  public add(notification: NotificationModel) {
    this.startLoading();

    this.serverAPI.addNotification(notification)
      .pipe(
        finalize(this.finishLoading.bind(this)),
        catchError((error) => {
          this.addErrorHandler(notification);

          return throwError(error);
        })
      )
      .subscribe(() => {
        this.fetchNotifications();
        this.showNotification(notification);
      });
  }

  public ngOnDestroy() {
    this.hasPermission$.complete();
    this.loading$.next(null);
    this.loading$.complete();
  }

  private addErrorHandler(notification: NotificationModel) {
    this.storeSrv.addNotification(notification).subscribe(
      () => {
        this.fetchLocalNotifications();
        this.showNotification(notification);
        this.sw.initSync(this.syncNotificationsEventName);
      }
    );
  }

  private updateLists() {
    this.fetchNotifications();
    this.fetchLocalNotifications();
  }

  private startLoading() {
    this.loading$.next(true);
  }

  private finishLoading() {
    this.loading$.next(null);
  }
}
