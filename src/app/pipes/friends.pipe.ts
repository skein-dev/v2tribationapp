import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'friends'
})
export class FriendsPipe implements PipeTransform {

  transform(items: any[], terms: string): any[] {
    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(terms);
    });
  }

}
