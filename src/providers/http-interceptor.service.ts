import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import { Settings } from './settings/settings';
import { ToastController } from 'ionic-angular';


@Injectable()
export class MainHttpInterceptor implements HttpInterceptor {

  public authToken: string = null


  constructor(private setting: Settings, private toastCtrl: ToastController) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let subscription: Observable<any> = null

    ////console.log("intercepted request ... ");
    // Clone the request to add the new header.

    subscription = Observable.fromPromise(
      this.getToken()
    )

    return subscription.flatMap(
      (token) => {

        if (!req.url.match('token')){

          const authReq = req.clone({ setHeaders: { 'Authorization': 'Token ' + token.token} });
          ////console.log(authReq)
          return next.handle(authReq)
          .catch((error: HttpErrorResponse, caught) => {
            if (error.status === 0) {
              this.toastCtrl.create({
                message: 'Check your internet conection, and try again',
                duration: 3000,
                position: 'top'
              });
            } else {
              this.toastCtrl.create({
                message: `${error.status} - ${error.message}`,
                showCloseButton: true,
                position: 'top'
              });
            }

            ////console.log(error)
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
    return await this.setting.getValue('api-token')
    .then(
      (res : any) =>  res    )
  }

}
