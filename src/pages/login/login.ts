import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { Settings } from './../../providers/settings/settings';
import { LoginProvider } from './../../providers/login/login';

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
    private settings: Settings) {
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
                  (res) => console.log(res)
                )
                .catch(
                  (e) => console.log(e)
                )
              }
          )
        },
        (e) => {
          console.log(e)
        }
      )

  }

}
