import { Injectable } from '@angular/core';
import { Api } from '../api/api';

@Injectable()
export class SamplesProvider {

  constructor(
    private api: Api,
    ) {
    //console.log('Hello NotebookProvider Provider');
  }

  search (filter=null, qsearch='', limit: number =1000,  offset: number=1, orderBy ='') {
    return this.api.post(
      `${this.api.urlSamples}/diff/?limit=${limit}&offset=${offset}&orderBy=${orderBy}&qsearch=${qsearch}`,
        {
          "diff":[],
          "filter":filter
        }
      )
  }

}
