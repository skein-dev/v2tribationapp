import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'team'
})
export class TeamPipe implements PipeTransform {
  transform(items: any[], terms: string): any[] {
    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(it => {

      return it.team_name.toLowerCase().includes(terms);

    });
  }
}
