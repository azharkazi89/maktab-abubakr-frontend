import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { StudentService } from '../students/students.service';
import {Fee, FeeDTO, Student, StudentFeeDTO} from '../models/all.models';
import {FeeService} from "./fees.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BackButtonDirective} from "../commons/back-button.directive";

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
  allFees = [];
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
        return fee;
      } else {
        return {
          month: month,
          year: new Date().getFullYear(),
          paymentDate:null,
          paidAmount: 0,
          status: 'UNPAID',
          recordedBy: '',
          paymentMode: 'PENDING',
          remark: ''
        };
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
  addFee(f:FeeDTO) {
    if (f) {
      this.feeService.create(f,this.studentId).subscribe(savedFee => {
        this.getStudentFees();
      });
    }
  }

  deleteFee(fee: FeeDTO) {
    const confirmDelete = confirm(`Are you sure you want to delete the fee for ${this.student.studentName}?`);
    if (confirmDelete && fee.id) {
      this.feeService.delete(fee.id).subscribe(Event => {
        this.getStudentFees();
      });
    }
  }

  editFee(f: FeeDTO) {
    if(f){
      this.feeService.updateFee(f).subscribe(updatedFee => {
        const index = this.fees.findIndex(fee => fee.id === updatedFee.id);
        if (index !== -1) {
          this.fees[index] = updatedFee; // update local table
        }
      });
      this.loadFees();
    }
  }

  calculateTotalFeesPaid(student: StudentFeeDTO): number {
    return student.fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  }

  calculateTotalFeesPending(student: StudentFeeDTO): number {
    const months = this.feeService.getMonthsPassed(student.admissionDate);
    const monthlyFee = 300;
    return (months * monthlyFee) - this.calculateTotalFeesPaid(student)<0?0:(months * monthlyFee) - this.calculateTotalFeesPaid(student);
  }

}
