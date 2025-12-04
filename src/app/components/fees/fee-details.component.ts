import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { StudentService } from '../students/students.service';
import {Fee, FeeDTO, Student, StudentFeeDTO} from '../models/all.models';
import {FeeService} from "./fees.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BackButtonDirective} from "../commons/back-button.directive";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-fee-details',
  templateUrl: './fee-details.component.html',
  styleUrls: ['./fee-details.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonDirective]
})
export class StudentFeeDetailsComponent implements OnInit {
  studentId!: number;
  student: StudentFeeDTO;
  fees: FeeDTO[] = [];
  allFees: FeeDTO[] = [];
  PAID: string='PAID';
  constructor(private route: ActivatedRoute, private router: Router, private studentService: StudentService,
              private feeService: FeeService) {}

  ngOnInit(): void {
    this.studentId = +this.route.snapshot.paramMap.get('id')!;
    this.getStudentFees();
  }

  loadFees() {
    // Assuming `fees` is already populated from backend
    this.allFees = this.months.map(month => {
      const fee = this.fees.find(f => f.month === month);
      if (fee) {
        return { ...fee }; // clone so we don't mutate original accidentally
      } else {
        return {
          id: undefined,
          month: month,
          year: new Date().getFullYear(),
          paymentDate: null,
          paidAmount: 0,
          status: 'UNPAID',
          recordedBy: '',
          paymentMode: 'PENDING',
          remark: '',
          studentId: this.studentId
        } as FeeDTO;
      }
    });
  }
  getStudentFees(): void {
    this.feeService.getStudentFees(this.studentId).subscribe(student => {
      this.student = student;
      this.fees = student.fees;
      this.loadFees();
    });
  }

  months: string[] = [
    'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'March', 'April', 'May'
  ];
  notifyParents() {
     const phone = this.student.phone;
      const msg = `Assalamu Alaikum,\n` +
                  `This is a fee reminder for ${this.student.studentName}.\n` +
                  //(fee.status ? `Pending amount: ₹${fee.totalAmount}.\n` : '') +
                  `Please contact the office if already paid.\n` +
                  `JazakAllah Khair.\n` +
                  `Anjuman Abubakr Masjid\n`+
                  `Contact: 9762608883\n`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank'); // Opens WhatsApp Web / mobile app
  }
  /*addFee() {
    const newFees = this.allFees;/!*.filter(
      f => !f.id && (f.paidAmount && f.paidAmount > 0 || f.status !== 'UNPAID')
    );*!/

    if (newFees.length === 0) {
      alert('No new fees to save.');
      return;
    }

    const calls = newFees.map(f => this.feeService.create(f, this.studentId));

    forkJoin(calls).subscribe({
      next: () => {
        alert('Fees saved successfully.');
        this.getStudentFees();
      },
      error: err => {
        console.error('Error saving fees', err);
        alert('Error while saving fees.');
      }
    });
  }
*/
  // ✅ UPDATE existing fee records (rows with id)
  editFee() {
    const existingFees = this.allFees;
    /*const existingFees = this.allFees.filter(f => !!f.id);

    if (existingFees.length === 0) {
      alert('No existing fees to update.');
      return;
    }*/

    const calls = existingFees.map(f => this.feeService.updateFee(f));

    forkJoin(calls).subscribe({
      next: () => {
        alert('Fees updated successfully.');
        this.getStudentFees();
      },
      error: err => {
        console.error('Error updating fees', err);
        alert('Error while updating fees.');
      }
    });
  }

  // ✅ DELETE all existing fee records for this student
 /* deleteFee() {
    const existingFees = this.allFees.filter(f => !!f.id);

    if (existingFees.length === 0) {
      alert('No fees to delete.');
      return;
    }

    const confirmDelete = confirm(
      `Are you sure you want to delete all fees for ${this.student.studentName}?`
    );
    if (!confirmDelete) {
      return;
    }

    const calls = existingFees.map(f => this.feeService.delete(f.id!));

    forkJoin(calls).subscribe({
      next: () => {
        alert('Fees deleted successfully.');
        this.getStudentFees();
      },
      error: err => {
        console.error('Error deleting fees', err);
        alert('Error while deleting fees.');
      }
    });
  }*/

  calculateTotalFeesPaid(student: StudentFeeDTO): number {
    return student.fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  }

  calculateTotalFeesPending(student: StudentFeeDTO): number {
    const months = this.feeService.getMonthsPassed(student.admissionDate);
    const monthlyFee = 300;
    return (months * monthlyFee) - this.calculateTotalFeesPaid(student)<0?0:(months * monthlyFee) - this.calculateTotalFeesPaid(student);
  }

}
