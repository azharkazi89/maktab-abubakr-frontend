import { Component } from '@angular/core';
import { UploadService } from './upload.service';
import {ManualData} from '../models/all.models'
import {CommonModule} from "@angular/common";
import {BackButtonDirective} from "../commons/back-button.directive";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    BackButtonDirective

  ]
})
export class UploadComponent {

  selectedFile?: File;
  progress = 0;
  message = '';
  students: ManualData[] =  [];

  constructor(private uploadService: UploadService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.progress = 0;
    this.message = '';
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.uploadService.uploadExcel(this.selectedFile).subscribe({
        next: (data: ManualData[]) => {
          this.students = data;
        }
      });
    } else {
      this.message = 'Please select a file first!';
    }
  }
}
