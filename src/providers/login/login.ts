import { Injectable } from '@angular/core';
import { Api } from '../api/api';

@Injectable()
export class LoginProvider {

  constructor(private api: Api) {
    //console.log('Hello LoginProvider Provider');
  }

  login(username: string, password: string) {
    return this.api.post('token/', { username, password })
  }

}
