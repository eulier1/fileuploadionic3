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

  private option : CameraOptions

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private androidPermissions: AndroidPermissions,
    public domSanitizer: DomSanitizer,
    public platform: Platform) {
      this.initImageUploaded()
  }

  onSelect(toggle: boolean) {
    if( toggle ) {
      this.loadCameraOrGallery('gallery')
    } else {
      this.loadCameraOrGallery('camera')
    }
  }

  private loadOption(load: string) {

    let sourceType: number = 0

    if (load == 'camera')
      sourceType = this.camera.PictureSourceType.CAMERA

    if (load == 'gallery')
      sourceType = this.camera.PictureSourceType.PHOTOLIBRARY

    this.option = {
      quality: 100,
      targetWidth: 600,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

  }
  private loadSelection() {

    this.platform.ready()
    .then( () => {
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      .then(
        result => {

          this.camera.getPicture(this.option).then((imageData) => {
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

          console.log('Has permission?',result.hasPermission)
        },
        err => {
          console.log(err)
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        }
      )}
    )
  }

  private loadCameraOrGallery(load: string) {
    if (load == 'camera') {
      this.loadOption(load)
      this.loadSelection()
    }

    if (load == 'gallery' ) {
      this.loadOption(load)
      this.loadSelection()
    }
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
