import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the NotebooksByIdPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'notebooksByIdAndTitle',
  pure: false
})
export class NotebooksByIdTitlePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[] = [], term: string = '') {
    let result = []
    console.log(items)

    if (items.length > 0 && term != ''){
      result = items.filter( (value) =>  (term.match(value.id) || (value.title.toLowerCase().indexOf(term.toLowerCase()) > -1) ) )
    }
    console.log(result)
    return result;

  }
}
