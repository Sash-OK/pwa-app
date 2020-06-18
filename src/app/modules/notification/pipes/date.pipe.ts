import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'appDte'
})
export class DatePipe implements PipeTransform {

  transform(date: string, format = 'DD.MM.YYYY HH:mm:ss'): string {
    return moment(date).format(format);
  }

}
