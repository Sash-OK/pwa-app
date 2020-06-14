import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export class MyValidators {
  static dateTime(control: AbstractControl): ValidationErrors | null {
    return control && control.value && moment(control.value).isValid() ? null : {dateTime: true};
  }
}
