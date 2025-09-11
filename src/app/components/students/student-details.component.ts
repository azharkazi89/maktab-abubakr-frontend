import {Component, OnInit} from '@angular/core';
import {StudentService} from './students.service'; // correct path
import {AttendanceSummary, Fee, Student, Teacher} from '../models/all.models'; // correct path
import {ActivatedRoute, Router} from '@angular/router';
import {ClassService} from "../classes/class.service";
import {AttendanceService} from "../attendance/attendance.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TeacherService} from "../teachers/teachers.service";
import {BackButtonDirective} from "../commons/back-button.directive";

@Component({
  selector: 'app-students',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonDirective]
})
export class StudentDetailsComponent implements OnInit {
  student: Student;
  attendanceSummary:AttendanceSummary;
  teachers:Teacher[];
  constructor(private router: ActivatedRoute, private route: Router,  // ← add this
              private studentService: StudentService,
              private teacherService: TeacherService,
              private attendanceService: AttendanceService) {
  }
  photoFile: File | null = null;
  photoPreview: string | null = null;
  showCamera = false;
  private stream: MediaStream | null = null;

  ngOnInit(): void {
    const id = this.router.snapshot.paramMap.get('id');
    if (id) {
      this.studentService.get(+id).subscribe((data: Student) => {
        this.student = data;
        this.calculateFees();
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        this.attendanceService.getAttendanceSummary(Number(id), year, month).subscribe(summary => {
          this.attendanceSummary = summary;
        });
        this.teacherService.getTeachersByClass(this.student.maktabClass?.id!).subscribe(teachers=>{
          this.teachers = teachers;
        });
      });
    }
  }

  editStudent() {
    this.route.navigate(['/students/edit', this.student.id]);
  }

  getAttendance(id: number) {
    this.route.navigate(['/student/' + id + '/attendance']);
  }

  getFeesDetails(id: number) {
    this.route.navigate(['/student/' + id + '/fees']);
  }

  totalFees: number = 0;
  paidFees: number = 0;
  dueFees: number = 0;
  monthlyFee: number = 300;
  calculateFees(): void {
      const admission = new Date(this.student.admissionDate);
    const today = new Date();

    // Calculate number of months from admission to today
    let months =
      (today.getFullYear() - admission.getFullYear()) * 12 +
      (today.getMonth() - admission.getMonth()) + 1;

    // Total fees = months * monthlyFee
    this.totalFees = months * this.monthlyFee;

    // Paid fees = sum of paidAmount in fees array
    if (this.student.fees && this.student.fees.length > 0) {
      this.paidFees = this.student.fees
        .map((fee: Fee) => fee.paidAmount)
        .reduce((sum: number, amount: number) => sum + amount, 0);
    } else {
      this.paidFees = 0;
    }


    // Due fees = total - paid
    this.dueFees = this.totalFees - this.paidFees;
  }

  showModal = false;
  editingStudent: any = null;

  openEditModal(student: any) {
    this.editingStudent = {...student};
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingStudent = null;
  }

  updateStudent() {
    if (!this.editingStudent) return;

    const formData = new FormData();
    formData.append('student', new Blob([JSON.stringify(this.editingStudent)], {type: 'application/json'}));

    if (this.photoPreview) {
      formData.append('photo', this.photoPreview);
    }

    this.studentService.updateStudent(formData).subscribe({
      next: (updatedStudent) => {
        this.closeModal();
      },
      error: (err) => console.error('Update failed:', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoFile = file;

      // Preview the image
      const reader = new FileReader();
      reader.onload = e => this.photoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  openCamera() {
    this.showCamera = true;
    navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
      this.stream = stream;
      const videoElement = document.querySelector('video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    }).catch(err => {
      console.error('Camera access denied', err);
    });
  }

  capturePhoto(videoElement: HTMLVideoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    this.photoPreview = canvas.toDataURL('image/png');
    this.closeCamera();
  }

  closeCamera() {
    this.showCamera = false;
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}

