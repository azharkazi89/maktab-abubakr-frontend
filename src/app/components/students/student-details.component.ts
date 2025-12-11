import {Component, OnInit} from '@angular/core';
import {StudentService} from './students.service'; // correct path
import {AttendanceSummary, Fee, Student, Teacher} from '../models/all.models'; // correct path
import {ActivatedRoute, Router} from '@angular/router';
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
  attendanceSummary: AttendanceSummary = { absent: 0 } as AttendanceSummary;
  teachers: Teacher[] = [];
  photoFile: File | null = null;
  photoPreview: string | null = null;
  uploadingPhoto: boolean = false;
  showCamera: boolean = false;
  stream: MediaStream | null = null;
  message: string = '';
  modalFileInput: HTMLInputElement | null = null;

  constructor(private router: ActivatedRoute, private route: Router,
              private studentService: StudentService,
              private teacherService: TeacherService,
              private attendanceService: AttendanceService) {
  }

  getStudentPhotoUrl(): string {
    if (this.photoPreview) {
      return this.photoPreview;
    }
    if (this.student?.imagePath) {
      return `http://localhost:8080/uploads/students/${this.student.imagePath}`;
    }
    const genderImage = this.student?.gender === 'Male' ? 'assets/boy-default.png' : 'assets/girl-default.png';
    return genderImage;
  }

  // ...existing code...

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file
      if (!this.isValidImageFile(file)) {
        alert('Please select a valid image file (JPG, PNG, GIF, WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }

      this.photoFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Upload photo
      this.uploadPhoto(file);
    }
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  }

  uploadPhoto(file: File): void {
    if (!this.student?.id) {
      alert('Student ID not found');
      return;
    }

    this.uploadingPhoto = true;
    this.studentService.uploadStudentPhoto(this.student.id, file).subscribe({
      next: (response: any) => {
        this.uploadingPhoto = false;
        this.student.imagePath = response.imagePath;
        alert('Photo uploaded successfully!');
        this.photoFile = null;
      },
      error: (error: any) => {
        this.uploadingPhoto = false;
        this.photoPreview = null;
        this.photoFile = null;
        console.error('Photo upload failed:', error);
        alert('Failed to upload photo. Please try again.');
      }
    });
  }

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
     // formData.append('photo', this.photoPreview);
    }

    this.studentService.updateStudent(formData).subscribe({
      next: () => {
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
      reader.onload = () => this.photoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  openCamera() {
    this.showCamera = true;
    // Delay to ensure video element is rendered in DOM
    setTimeout(() => {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false }).then(stream => {
        this.stream = stream;
        const videoElement = document.querySelector('video') as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
          // Force play for better compatibility
          videoElement.play().catch(err => {
            console.error('Error playing video:', err);
          });
        }
      }).catch(err => {
        console.error('Camera access denied:', err);
        this.message = 'Camera access denied or not available';
        this.closeCamera();
      });
    }, 100);
  }

  capturePhoto(videoElement: HTMLVideoElement) {
    if (!videoElement) {
      console.error('Video element not found');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    if (ctx && canvas.width > 0 && canvas.height > 0) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      this.photoPreview = canvas.toDataURL('image/png');

      // Convert base64 to File and upload
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'captured-photo.png', { type: 'image/png' });
          this.photoFile = file;
          this.message = 'Photo captured successfully!';
          this.uploadPhoto(file);
        }
      }, 'image/png');
    } else {
      this.message = 'Failed to capture photo. Please try again.';
      console.error('Canvas context or dimensions invalid');
    }

    this.closeCamera();
  }

  closeCamera() {
    this.showCamera = false;
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}

