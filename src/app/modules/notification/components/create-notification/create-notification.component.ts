import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyValidators } from '../../utils/my-validators';
import { UserNotificationService } from '../../services/user-notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.css']
})
export class CreateNotificationComponent {
  public storing$: Observable<boolean> = this.notificationSrv.loading$;
  public form = new FormGroup({
    message: new FormControl('', [Validators.required]),
    dateTime: new FormControl('', [Validators.required, MyValidators.dateTime])
  });

  constructor(private notificationSrv: UserNotificationService) { }

  public addNotification() {
    this.notificationSrv.add(this.form.getRawValue());
  }
}
