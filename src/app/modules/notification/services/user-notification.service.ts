import { Injectable, OnDestroy } from '@angular/core';
import { NotificationModel } from '../models/notification.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreDriverService } from '../../data-store/services/store-driver.service';
import { delay, filter, finalize } from 'rxjs/operators';
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

  constructor(
    private storeSrv: StoreDriverService,
    private sw: SwDriverService,
    private api: NotificationApiService
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
    return this.api.getNotifications()
      .pipe(finalize(this.finishLoading.bind(this)));
  }

  public showNotification(notification: NotificationModel) {
    const timeout = moment(notification.dateTime).valueOf() - moment.now().valueOf();
    this.sw.notification().pipe(
      delay(timeout > 0 ? timeout : 0)
    ).subscribe((dn) => {
      dn.withOptions(NotificationAdapter.getSimple(notification))
        .withDismiss()
        .show()
        .subscribe(() => console.log('Message should be visible', notification));
    });
  }

  public add(notification: NotificationModel) {
    this.startLoading();

    this.api.addNotification(notification)
      .pipe(finalize(this.finishLoading.bind(this)))
      .subscribe(() => {
        this.fetchNotifications();
        this.showNotification(notification);
      });
  }

  public ngOnDestroy() {
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
