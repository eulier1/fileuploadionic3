import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class UploadProvider {

  constructor(
    private api: Api,
    ) {
    //console.log('Hello NotebookProvider Provider');
  };

  createEntry(instance){
      return this.api.post(`${this.api.urlNotebooks}/${instance.labbookFK}/entries/`, instance).toPromise()

  }
  getDefaultEntry(bookId: number, shareCode: string = '') {
    return this.api.get(
             `${this.api.urlNotebooks}/${bookId}/entries/default/`)
            .toPromise()
            .then((r: any)=>{
              r.datetime = new Date (r.datetime);
               return r;
            })
  }


  uploadFile(bookId: number | string, entryCode: number | string, file: Blob, filename: string) {

    const formData = new FormData()
    formData.append('uploadImage', file, filename)

    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });

    return this.api.post( `${this.api.urlNotebooks}/${bookId}/entries/${entryCode}/upldfiles/`, formData , headers).toPromise()
  }

}
