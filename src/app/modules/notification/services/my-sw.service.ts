import { Injectable } from '@angular/core';

@Injectable()
export class MySwService {
  private readonly syncNotificationsEventName = 'syncPostNotification';

  public startSync() {
    navigator.serviceWorker.ready.then((swReg) => {
      swReg.sync.getTags().then(
        tags => {
          if (tags.includes(this.syncNotificationsEventName)) {
            return;
          }

          swReg.sync.register(this.syncNotificationsEventName);
        }
      );
    });
  }
}
