import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow, isToday, format } from 'date-fns';

@Pipe({
  name: 'timeAgoPipe',
  standalone: true
})
export class TimeAgoPipePipe implements PipeTransform {

  transform(value: string | Date): string {
    const createdTime = new Date(value);

    if (isToday(createdTime)) {
      return formatDistanceToNow(createdTime, { addSuffix: true });
    } else {
      return format(createdTime, 'MMM d, yyyy');  
    }
  }

}
