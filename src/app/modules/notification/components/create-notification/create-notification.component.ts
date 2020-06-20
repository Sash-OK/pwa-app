import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyValidators } from '../../utils/my-validators';
import { UserNotificationService } from '../../services/user-notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateNotificationComponent {
  public inProcess$: Observable<boolean> = this.notificationSrv.loading$;
  public form = new FormGroup({
    message: new FormControl('Test message', [Validators.required]),
    dateTime: new FormControl(new Date(), [Validators.required, MyValidators.dateTime])
  });

  constructor(private notificationSrv: UserNotificationService) { }

  public addNotification() {
    this.notificationSrv.add(this.form.getRawValue());
  }
}
