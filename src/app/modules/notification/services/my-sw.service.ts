import { Injectable } from '@angular/core';
import { NotificationModel } from '../models/notification.model';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable()
export class MySwService {
  private swReg: ServiceWorkerRegistration = null;
  private subscription$: Observable<PushSubscription> = null;

  constructor() {
    navigator.serviceWorker.ready.then((swReg) => {
      this.swReg = swReg;
      this.subscription$ = fromPromise(swReg.pushManager.getSubscription());
      this.swReg.sync.register('showNotifications');
    });
  }

  public showNotification(message: NotificationModel) {
    if (this.subscription$) {
      navigator.serviceWorker.controller.postMessage(message);
    }
  }
}
