import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { fromEvent, NEVER, Observable, Subject } from 'rxjs';
import { DesktopNotification } from '../../notification/utils/desktop-notification';

@Injectable()
export class SwDriverService {
  public messages$: Subject<MessageEvent> = new Subject();
  private readonly isAPISupported: boolean;
  private readonly swFilePath = '/sw.js';

  constructor(private app: ApplicationRef, private ngZone: NgZone) {
    this.isAPISupported = 'serviceWorker' in navigator;

    if (this.isAPISupported) {
      this.app.isStable
        .pipe(filter(Boolean), take(1))
        .subscribe(() => this.registerSW());
    }
  }

  private get registeredSW(): Observable<ServiceWorkerRegistration> {
    if (!this.isAPISupported) {
      return NEVER;
    }
    return fromPromise(navigator.serviceWorker.ready);
  }

  public initSync(syncTag) {
    this.registeredSW.subscribe((swReg) => {
      fromPromise(swReg.sync.getTags()).subscribe(
        tags => {
          if (tags.includes(syncTag)) {
            return;
          }

          swReg.sync.register(syncTag);
        }
      );
    });
  }

  private listenMessageFromSW() {
    fromEvent<MessageEvent>(navigator.serviceWorker, 'message').subscribe(ev => {
      this.ngZone.run(() => this.messages$.next(ev));
    });
  }

  private registerSW() {
    navigator.serviceWorker.register(this.swFilePath, {scope: '/'})
      .then(
        (reg) => this.listenMessageFromSW(),
        (error) => console.log('Registration failed', error)
      );
  }

  public notification(): Observable<DesktopNotification> {
    return new Observable((observer) => {
      this.registeredSW.subscribe(reg => {
        observer.next(new DesktopNotification(reg));
        observer.complete();
      });
    });
  }
}
