import { NotebookProvider } from './../../providers/notebook/notebook';
import { SamplesProvider } from '../../providers/sample/sample';
import { Component } from '@angular/core';
import { NavController, Platform, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

interface IListResponse {
  list: any[];
  listIds: any[];
  page_request: IPageRequest;

}

interface IPageRequest {
  limit: string;
  num_pages: number;
  page: string;
  orderBy: string[];
}
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public base64Image = ''
  public nameImage = ''
  public blobImage = null

  public option : CameraOptions

  public searchQueryNotebook: string = ''
  public notebookSelected: { id: number , title: string } = { id: 0, title: '' }
  public notebookItems: Array<any>
  public placeholderNotebooks: string = 'Notebooks'

  public searchQuerySample: string = ''
  public sampleSelected: { id: number , name: string } = { id: 0, name: '' }
  public sampleItems: Array<any>
  public placeholderSample: string = 'Sample'

  public maxlenTextarea: number = 240
  public description: FormControl = new FormControl()
  constructor(
    public navCtrl: NavController,
    public domSanitizer: DomSanitizer,
    public platform: Platform,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    private androidPermissions: AndroidPermissions,
    private notebookProvider: NotebookProvider,
    private samplesProvider: SamplesProvider
    ) {
      this.notebookProvider.search().subscribe(
        (response: IListResponse | any) => {
          this.notebookItems = response.list
          console.log('Notebook', response.list )
        }
      )

      this.samplesProvider.search().subscribe(
        (response: IListResponse | any) => {
          this.sampleItems = response.list
          console.log('Samples', response.list )
        }
      )

      this.description.valueChanges
                      .startWith(null)
                      .pairwise()
                      .subscribe( ([previousValue, currentValue]) => {
                        let compare = previousValue != null ? currentValue.length - previousValue.length : null
                        if (previousValue === null && currentValue) {
                          this.maxlenTextarea = this.maxlenTextarea - 1
                        } else {
                          if (compare < 0) {
                            this.maxlenTextarea = this.maxlenTextarea + 1
                          }
                          if (compare > 0) {
                            this.maxlenTextarea = this.maxlenTextarea - 1
                          }

                        }
                      })
  }

  onSelect() {

    let iconImage = ''
    let iconCamera = ''

    if (this.platform.is('ios')){
      iconImage = 'ios-image'
      iconCamera = 'ios-camera'
    }

    if (this.platform.is('android')){
      iconImage = 'md-image'
      iconCamera = 'md-camera'
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select place to upload',
      buttons: [
        {
          text: 'Camera',
          icon: iconCamera,
          handler: () => {
            console.log('Camera clicked');
            this.loadCameraOrGallery('camera')
          }
        },
        {
          text: 'Gallery',
          icon: iconImage,
          handler: () => {
            console.log('Gallery clicked');
            this.loadCameraOrGallery('gallery')
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();

  }

  onSelectNotebook(item) {
    this.notebookSelected = item
    this.placeholderNotebooks = this.notebookSelected.id + ' : ' + this.notebookSelected.title
    this.searchQueryNotebook = ''
    console.log('onSelectNotebook', this.notebookSelected)
  }

  onSelectSample(item) {
    this.sampleSelected = item
    this.placeholderSample = this.sampleSelected.id + ' : ' + this.sampleSelected.name
    this.searchQuerySample = ''
    console.log('onSelectSample', this.sampleSelected)
  }

  checkText(el, ev){
    console.log(ev)


    if (ev.inputType == "deleteContentBackward" ){
      this.maxlenTextarea = this.maxlenTextarea + 1
    } else {
      this.maxlenTextarea = this.maxlenTextarea - 1
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
            this.base64Image = 'data:image/jpeg;base64,' + imageData;
            this.nameImage = `image${Math.random()}`
            this.blobImage = this.dataURItoBlob(this.base64Image)


            console.log(this.blobImage)

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

  private dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }

}
