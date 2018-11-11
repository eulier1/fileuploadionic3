import { UploadProvider } from './../../providers/upload/upload';
import { NotebookProvider } from './../../providers/notebook/notebook';
import { SamplesProvider } from '../../providers/sample/sample';
import { Component } from '@angular/core';
import { NavController, Platform, ActionSheetController, LoadingController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { HttpErrorResponse } from '@angular/common/http';

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
  public blobImage: Blob = null

  public option : CameraOptions

  public searchQueryNotebook: string = ''
  public notebookSelected: { id: number , title: string } = { id: 0, title: '' }
  public notebookItems: Array<any>
  public placeholderNotebooks: string = 'Notebooks'

  public searchQuerySample: string = ''
  public sampleSelected: { id: number , name: string } = { id: 0, name: '' }
  public sampleItems: Array<any>
  public placeholderSample: string = 'Sample'

  public maxlenTextarea: number = 8192
  public description: FormControl = new FormControl()

  public showLoader: boolean = false
  constructor(
    public navCtrl: NavController,
    public domSanitizer: DomSanitizer,
    public platform: Platform,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private androidPermissions: AndroidPermissions,
    private notebookProvider: NotebookProvider,
    private samplesProvider: SamplesProvider,
    private uploadProvider: UploadProvider
    ) {
      this.initialDataState()
      this.loadNoteBookProviderSearch()
      this.loadSampleProviderSearch()
      this.textareaCharAvailable()

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
            //console.log('Camera clicked');
            this.pickCameraOrGallery('camera')
          }
        },
        {
          text: 'Gallery',
          icon: iconImage,
          handler: () => {
            //console.log('Gallery clicked');
            this.pickCameraOrGallery('gallery')

          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
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
    //console.log('onSelectNotebook', this.notebookSelected)
  }

  onSelectSample(item) {
    this.sampleSelected = item
    this.placeholderSample = this.sampleSelected.id + ' : ' + this.sampleSelected.name
    this.searchQuerySample = ''
    //console.log('onSelectSample', this.sampleSelected)
  }

  addFileToNewEntry(files, labbookFK:number = 0 , sampleFK:number = null, description, content='') {

    const loader = this.loadingCtrl.create({
      content: "Uploading File, please stand by...",
    });
    loader.present();

    let entryInfo = {'labbookFK': labbookFK, 'sampleFK' : sampleFK, 'content': content, 'description': description}
    let entry = null


    return this.uploadProvider.getDefaultEntry(entryInfo['labbookFK'])
        .then((r : any) => {
            entry = r;
            entry.saved = true;
            entry = { ...entry, ...entryInfo };
            ////console.log(entry)
            this.uploadProvider.createEntry(entry).then(
              (res) => {}//console.log(res)
            ).catch(
              (e: HttpErrorResponse) => {
                //console.log(e)
                const toast = this.toastCtrl.create({
                  message: `${e.status} - ${e.message}`  ,
                  showCloseButton : true,
                  closeButtonText : "OK",
                  position: 'top'
                });
                toast.present();
                loader.dismiss();
              }
            )
        })
        .catch(
          (e) => {
            //console.log(e)
            const toast = this.toastCtrl.create({
              message: `${e.status} - ${e.message}`  ,
              showCloseButton : true,
              closeButtonText : "OK",
              position: 'top'
            });
            toast.present();
            loader.dismiss();
          }
        )
        .then((response: any) => {
          //console.log(response)

            this.uploadProvider.uploadFile(entry.labbookFK, entry.entrycode, files, this.nameImage).then(
              (res) => {
                //console.log(res)
                loader.dismiss()
                const toast = this.toastCtrl.create({
                  message: `File uploaded`  ,
                  showCloseButton : true,
                  closeButtonText : "OK",
                  position: 'top'
                });
                this.initialDataState()
                toast.present();
              }
            )
            .catch(
              (e) => {
                //console.log(e)
                const toast = this.toastCtrl.create({
                  message: `${e.status} - ${e.message}`  ,
                  showCloseButton : true,
                  closeButtonText : "OK",
                  position: 'top'
                });
                toast.present();
                loader.dismiss();
              }
            )
        })
        .catch(
          (e) => {
            //console.log(e)
            const toast = this.toastCtrl.create({
              message: `${e.status} - ${e.message}`  ,
              showCloseButton : true,
              closeButtonText : "OK",
              position: 'top'
            });
            toast.present();
            loader.dismiss();
          }
        )

  }

  goToLogin() {
    this.navCtrl.push('LoginPage')
  }

  private initialDataState() {
    this.blobImage = null
    this.notebookSelected = { id: 0, title: '' }
    this.sampleSelected= { id: 0, name: '' }
    this.searchQueryNotebook = ''
    this.searchQuerySample = ''
    this.description.reset('')
    this.placeholderNotebooks = 'Notebooks'
    this.placeholderSample = 'Sample'
    this.maxlenTextarea = 8192
  }

  private loadCameraOrGalleryOption(load: string) {

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

  private loadCameraOrGallerySelection() {

    this.platform.ready()
    .then( () => {
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      .then(
        result => {

          this.camera.getPicture(this.option).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            // //console.log(imageData)
            this.base64Image = 'data:image/jpeg;base64,' + imageData;
            this.nameImage = `image${Math.random()}`
            this.blobImage = this.dataURItoBlob(this.base64Image)


            //console.log(this.blobImage)

          }, (err) => {
            // Handle error
            //console.log(err)
          })

          //console.log('Has permission?',result.hasPermission)
        },
        err => {
          //console.log(err)
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        }
      )}
    )
  }

  private pickCameraOrGallery(load: string) {
    if (load == 'camera') {
      this.loadCameraOrGalleryOption(load)
      this.loadCameraOrGallerySelection()
    }

    if (load == 'gallery' ) {
      this.loadCameraOrGalleryOption(load)
      this.loadCameraOrGallerySelection()
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

  private loadNoteBookProviderSearch() {
    this.notebookProvider.search().subscribe(
      (response: IListResponse | any) => {
        this.notebookItems = response.list
        //console.log('Notebook', response.list )
      }
    )
  }

  private loadSampleProviderSearch() {
    this.samplesProvider.search().subscribe(
      (response: IListResponse | any) => {
        this.sampleItems = response.list
        //console.log('Samples', response.list )
      }
    )
  }

  private textareaCharAvailable() {
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

}
