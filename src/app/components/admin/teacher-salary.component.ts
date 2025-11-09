import { Component, OnInit } from '@angular/core';
import { TeacherSalaryService } from '../../services/teacher-salary.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-teacher-salary',
  template: ``,
  styles: [`
    .container { max-width: 1200px; margin: auto; }
    .mat-form-field { margin-bottom: 1rem; }
  `]
})
export class TeacherSalaryComponent implements OnInit {
  salaryForm: FormGroup;
  salaries: any[] = [];
  teachers: any[] = [];
  editMode = false;
  editId: number | null = null;
  displayedColumns: string[] = ['teacherName', 'amount', 'salaryMonth', 'status', 'actions'];

  constructor(
    private fb: FormBuilder,
    private salaryService: TeacherSalaryService,
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
    // Load teachers (you need to implement this using your teacher service)
    // this.loadTeachers();
  }

  loadSalaries() {
    this.salaryService.getAllSalaries().subscribe(
      data => this.salaries = data,
      error => this.showError('Error loading salaries')
    );
  }

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
      salaryMonth: salary.salaryMonth,
      remarks: salary.remarks
    });
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

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}
