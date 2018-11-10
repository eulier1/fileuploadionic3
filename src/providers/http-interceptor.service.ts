import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import { Settings } from './settings/settings';


@Injectable()
export class MainHttpInterceptor implements HttpInterceptor {

  public authToken: string = null
  public subscription: Observable<any> = null

  constructor(private setting: Settings) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log("intercepted request ... ");
    // Clone the request to add the new header.

    this.subscription = Observable.fromPromise(
      this.getToken()
    )

    return this.subscription.flatMap(
      (token) => {
        if (!req.url.match('token')){
          console.log(token)
          const authReq = req.clone({ setHeaders: { 'Authorization': 'Token ' + token} });
          return next.handle(authReq)
          .catch((error, caught) => {
          return Observable.throw(error);
          }) as any;
        } else {
          return next.handle(req.clone())
          .catch((error, caught) => {
          return Observable.throw(error);
          }) as any;
        }
      }
    )
  }

  async getToken () {
    return await this.setting.getValue('api-token').then(
      (res : any) => res.token
    )
  }

}
