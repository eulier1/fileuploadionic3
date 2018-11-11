import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the NotebooksByIdPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sampleByIdAndTitle',
  pure: false
})
export class SampleByIdTitlePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[] = [], term: string = '') {
    let result = []
    console.log(items)

    if (items.length > 0 && term != ''){
      result = items.filter( (value) =>  (term.match(value.id) || (value.name.toLowerCase().indexOf(term.toLowerCase()) > -1) ) )
    }
    console.log(result)
    return result;

  }
}
