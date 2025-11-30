import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TeacherSalaryService } from './teacher-salary.service';
import { TeacherService } from '../teachers/teachers.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule        // 👈 added for [(ngModel)]
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TeacherSalary, Teacher } from '../models/all.models';

@Component({
  selector: 'app-teacher-salary',
  templateUrl: './teacher-salary.component.html',
  styleUrls: ['./teacher-salary.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,          // 👈 added
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressBarModule
  ]
})
export class TeacherSalaryComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  salaryForm: FormGroup;
  salaries: TeacherSalary[] = [];
  teachers: Teacher[] = [];
  editMode = false;
  editId: number | null = null;
  displayedColumns: string[] = ['teacherName', 'amount', 'salaryMonth', 'status', 'actions'];
  isImporting = false;
  importProgress = 0;

  // 🔍 FILTERS
  filterName: string = '';
  filterMonth: string = '';   // from <input type="month">, e.g. "2025-11"
  filterStatus: string = '';  // '', 'PAID', 'PENDING'

  constructor(
    private fb: FormBuilder,
    private salaryService: TeacherSalaryService,
    private teacherService: TeacherService,
    private snackBar: MatSnackBar
  ) {
    this.salaryForm = this.fb.group({
      teacherId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      salaryMonth: ['', Validators.required],
      remarks: ['']
    });
  }

  ngOnInit() {
    this.loadSalaries();
    this.loadTeachers();
  }

  loadTeachers() {
    this.teacherService.getAll().subscribe(
      data => this.teachers = data,
      error => console.error('Error loading teachers:', error)
    );
  }

  loadSalaries() {
    this.salaryService.getAllSalaries().subscribe(
      data => this.salaries = data,
      error => this.showError('Error loading salaries')
    );
  }

  // ----------------------------------
  // FILTERED VIEW USED BY THE TABLE
  // ----------------------------------
  // In HTML: *ngFor="let element of filteredSalaries"
  get filteredSalaries(): TeacherSalary[] {
    return this.salaries.filter(salary => {
      let matches = true;

      // Filter by teacher name (case-insensitive)
      if (this.filterName.trim()) {
        const name = (salary.teacher?.fullName || '').toLowerCase();
        matches = matches && name.includes(this.filterName.trim().toLowerCase());
      }

      // Filter by month (compare "YYYY-MM")
      if (this.filterMonth) {
        const salaryMonth = this.normalizeMonth(salary.salaryMonth as any);
        matches = matches && salaryMonth === this.filterMonth;
      }

      // Filter by status
      if (this.filterStatus === 'PAID') {
        matches = matches && !!(salary as any).isPaid;
      } else if (this.filterStatus === 'PENDING') {
        matches = matches && !(salary as any).isPaid;
      }

      return matches;
    });
  }

  // Normalizes salaryMonth (Date | string) to "YYYY-MM"
  private normalizeMonth(value: any): string {
    if (!value) {
      return '';
    }

    // If already "YYYY-MM" (from input type="month")
    if (typeof value === 'string' && value.length === 7 && value.includes('-')) {
      return value;
    }

    let date: Date;
    if (value instanceof Date) {
      date = value;
    } else {
      // Attempt parse from string
      date = new Date(value);
    }

    if (isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  // ----------------------------------
  // SUMMARY CARDS (TOP SECTION)
  // ----------------------------------

  // Distinct teacher count in the filtered list
  get totalTeachers(): number {
    const ids = new Set(this.filteredSalaries.map(s => s.teacherId));
    return ids.size;
  }

  get totalPaidAmount(): number {
    return this.filteredSalaries
      .filter(s => (s as any).isPaid)
      .reduce((sum, s: any) => sum + (s.amount || 0), 0);
  }

  get totalPendingAmount(): number {
    return this.filteredSalaries
      .filter(s => !(s as any).isPaid)
      .reduce((sum, s: any) => sum + (s.amount || 0), 0);
  }

  // ----------------------------------
  // FORM SUBMIT / CRUD
  // ----------------------------------

  onSubmit() {
    if (this.salaryForm.valid) {
      if (this.editMode && this.editId) {
        this.salaryService.updateSalaryRecord(this.editId, this.salaryForm.value).subscribe(
          () => {
            this.showSuccess('Salary record updated');
            this.resetForm();
            this.loadSalaries();
          },
          error => this.showError('Error updating salary record')
        );
      } else {
        this.salaryService.createSalaryRecord(this.salaryForm.value).subscribe(
          () => {
            this.showSuccess('Salary record created');
            this.resetForm();
            this.loadSalaries();
          },
          error => this.showError('Error creating salary record')
        );
      }
    }
  }

  editSalary(salary: any) {
    this.editMode = true;
    this.editId = salary.id;
    this.salaryForm.patchValue({
      teacherId: salary.teacher.id,
      amount: salary.amount,
      salaryMonth: this.normalizeMonth(salary.salaryMonth),
      remarks: salary.remarks
    });
    window.scrollTo(0, 0);
  }

  deleteSalary(id: number) {
    if (confirm('Are you sure you want to delete this salary record?')) {
      this.salaryService.deleteSalaryRecord(id).subscribe(
        () => {
          this.showSuccess('Salary record deleted');
          this.loadSalaries();
        },
        error => this.showError('Error deleting salary record')
      );
    }
  }

  markAsPaid(id: number) {
    this.salaryService.markSalaryAsPaid(id).subscribe(
      () => {
        this.showSuccess('Salary marked as paid');
        this.loadSalaries();
      },
      error => this.showError('Error marking salary as paid')
    );
  }

  resetForm() {
    this.salaryForm.reset();
    this.editMode = false;
    this.editId = null;
  }

  // ----------------------------------
  // IMPORT FROM EXCEL
  // ----------------------------------

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const allowedExtensions = ['xlsx', 'xls'];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';

      if (!allowedExtensions.includes(fileExtension)) {
        this.showError('Please upload an Excel file (.xlsx or .xls)');
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        this.showError('File size should not exceed 10MB');
        return;
      }

      this.importTeacherSalaries(file);
    }
  }

  importTeacherSalaries(file: File) {
    this.isImporting = true;
    this.importProgress = 0;

    this.salaryService.importTeacherSalariesFromExcel(file).subscribe(
      (response: any) => {
        const count = response?.length || 0;
        this.isImporting = false;
        this.importProgress = 100;

        if (count > 0) {
          this.showSuccess(`Successfully imported ${count} teacher salary record(s)`);
          this.loadSalaries();
          // Reset file input
          this.fileInput.nativeElement.value = '';
          setTimeout(() => this.importProgress = 0, 1000);
        } else {
          this.showError('No records were imported from the file');
        }
      },
      (error: any) => {
        this.isImporting = false;
        console.error('Import error:', error);
        const errorMessage = error?.error?.message || 'Error importing teacher salaries from Excel';
        this.showError(errorMessage);
      }
    );
  }

  // ----------------------------------
  // SNACKBARS
  // ----------------------------------

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}
