import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public imageUploaded: {
    name: string,
    data: string,
    mimeType: string
  }

  private options: CameraOptions = {
    quality: 100,
    targetWidth: 600,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private androidPermissions: AndroidPermissions,
    public domSanitizer: DomSanitizer,
    public platform: Platform) {
      this.initImageUploaded()
  }

  selectCamera() {

    this.platform.ready()
    .then( () => {
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      .then(
        result => {
          this.initCamera()
          console.log('Has permission?',result.hasPermission)
        },
        err => {
          console.log(err)
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        }
      )}
    )


  }

  onSelect(toggle: boolean) {
    if( toggle ) {
      console.log("this.selectImagePicker")
    } else {
      this.selectCamera()
    }
  }

  private initCamera() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // console.log(imageData)
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageUploaded.name = `image${Math.random()}`
      this.imageUploaded.data = base64Image
      this.imageUploaded.mimeType = 'image/jpeg'

     }, (err) => {
      // Handle error
      console.log(err)
     })
  }

  private initImageUploaded() {
    this.imageUploaded =
      {
        name : '',
        data : '',
        mimeType : 'image/jpeg'
      }
  }


}
