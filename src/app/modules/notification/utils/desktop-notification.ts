import { fromPromise } from 'rxjs/internal-compatibility';
import { Observable } from 'rxjs';

export class DesktopNotification {
  private options: NotificationOptions = {
    badge: '/assets/icons/icon-192.png',
  };

  constructor(private swReg: ServiceWorkerRegistration) {}

  public withOptions(options: NotificationOptions) {
    this.options = {...this.options, ...options};
    return this;
  }

  public withIcon(iconPath: string) {
    this.options = {...this.options, icon: iconPath};
    return this;
  }

  public show(title = 'Notification Title'): Observable<any> {
    return fromPromise(this.swReg.showNotification(title, this.options));
  }
}
