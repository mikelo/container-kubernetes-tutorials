import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant/services/restaurant.service';
import { UploadManagerService } from '../services/upload-manager.service';
import { ErrorService } from '../error/services/error.service';
import { MessageService } from '../messages/services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  filesToUpload: Array<File> = [];

  constructor(private restaurantService: RestaurantService,
              private uploadManagerService: UploadManagerService,
              private errorService: ErrorService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.errorService.clear();
    this.messageService.clear();
  }

  onclick(endpoint: string): void {
    this.errorService.clear();
    this.messageService.clear();
    switch (endpoint) {
      case '/healthz':
        this.restaurantService.getHealthz().subscribe(response => this.processResponse(response));
        break;
      case '/dir':
        this.uploadManagerService.getUploadDir().subscribe(response => this.processResponse(response));
        break;
      case '/config':
        this.uploadManagerService.getConfigurationProperties().subscribe(response => this.processResponse(response));
        break;
      case '/list':
        this.uploadManagerService.getFiles().subscribe(response => this.processFileListResponse(response));
        break;
      case '/delete':
        this.uploadManagerService.deleteFiles().subscribe(response => this.processResponse(response));
        break;
      default:
        console.log('PLUTO !!!');
        break;
    }
  }

  upload() {
    this.errorService.clear();
    this.messageService.clear();
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    console.log(files);
    for(let i = 0; i < files.length; i++){
      formData.append('fileToUpload', files[i], files[i]['name']);
    }
    console.log('form data variable : ' + formData.toString());
    this.uploadManagerService.upload(formData).subscribe(response => this.processFileUploadResponse(response));
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  processResponse(obj: string): void {
    console.log(obj);
    const jsonObj = JSON.parse(JSON.stringify(obj));
    this.messageService.add(jsonObj.response);
  }

  processFileListResponse(obj: string): void {
    console.log(obj);
    const jsonObj = JSON.parse(JSON.stringify(obj));
    const size = jsonObj.response[0].size;
    const msg = jsonObj.response[1].message;
    const files = jsonObj.response[2].files;
    this.messageService.add(msg);
    if (size !== 0) {
      files.forEach(element => {
        this.messageService.add(element);
      });
    }
  }

  processFileUploadResponse(obj: string): void {
    console.log(obj);
    const jsonObj = JSON.parse(JSON.stringify(obj));
    const size = jsonObj.response[0].size;
    const msg = jsonObj.response[1].message;
    const files = jsonObj.response[2].files;
    this.messageService.add(msg);
    if (size !== 0) {
      files.forEach(element => {
        this.messageService.add(element.originalname);
      });
    }
  }

}
