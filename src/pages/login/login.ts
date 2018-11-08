import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Settings } from './../../providers/settings/settings';
import { LoginProvider } from './../../providers/login/login';
import { HomePage } from '../home/home';
import { HttpErrorResponse } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public username: string = 'mobileapp'
  public password: string = 'mobileapp'

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    private settings: Settings,
    private toastCtrl: ToastController) {
  }

  login(username: string, password: string) {
    //this.$window.localStorage.removeItem('api-token');

    return this.loginProvider.login(username, password)
      .subscribe(
        (res: any) => {
          // Clear old token
          this.settings.clear().then(
            (sucess) => {
                this.settings.setValue('api-token', res)
                .then(
                  (res) => {
                    console.log(res)
                    this.navCtrl.push(HomePage)
                  }
                )
                .catch(
                  (e) => {
                    console.log(e)
                    this.displayToast( {msg: e, duration: 5000, pos: 'top', shCloseButton: false } )
                  }
                )
              }
          )
        },
        (e: HttpErrorResponse) => {
          console.log(e)
          this.displayToast( {msg: e.message, duration: 5000, pos: 'top', shCloseButton: false } )
        }
      )

  }

  displayToast( config : {msg: string, duration: number, pos: string, shCloseButton: boolean}) {
    let toast = this.toastCtrl.create({
      message: config.msg,
      duration: config.duration,
      position: config.pos,
      showCloseButton: config.shCloseButton
    });
    toast.present();
  }

}
