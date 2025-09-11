import {Component, OnInit} from '@angular/core';
import {FeeService} from './fees.service';
import {StudentService} from '../students/students.service';
import {ClassService} from '../classes/class.service';
import {BatchFeeRequest, BatchFeeResponse, Fee, FeeResponse, MaktabClass, Student} from '../models/all.models';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router, RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BackButtonDirective} from "../commons/back-button.directive";

interface SelectableStudent extends Student {
  selected: boolean;
  status: string;
  selectAll: boolean;
}

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BackButtonDirective]
})
export class FeesComponent implements OnInit {
  DUE: string = 'Due';
  PAID: string = 'Paid';

  createdFees: FeeResponse[] = [];
  students: Student[] = [];
  message: string = '';
  fees: Fee[] = [];
  classes: MaktabClass[] = [];
  //classes: string[] = ['Class 1', 'Class 2', 'Class 3'];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  selectedClass: string = '';
  selectedMonth: string = '';
  selectedStatus: string = 'ALL';
  phone: string = '';
  rollNo: string = '';
  searchText: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  //students: StudentFeeDTO[] = [];
  constructor(private feeService: FeeService, private studentService: StudentService,
              private classService: ClassService, private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadClasses();
    this.totalPages = Math.ceil(this.students.length / this.itemsPerPage);
  }

  loadClasses() {
    this.classService.getAll().subscribe(
      (data: MaktabClass[]) => {
        this.classes = data;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching students', error);
      }
    );
  }

  private loadStudents() {
    this.studentService.getAll().subscribe(
      (data: Student[]) => {
        this.students = data;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching students', error);
      }
    );
  }

  filteredStudents(): Student[] {
    const lower = this.searchText.toLowerCase();
    return this.students.filter((s: Student) => {
      const matchesClass = this.selectedClass === '' || s.maktabClass.id.toString() === this.selectedClass;
      const matchesStatus = this.selectedStatus === 'ALL' || this.getStatus(s) === this.selectedStatus;
      const matchesSearch =
        s.name.toLowerCase().includes(lower) ||
        s.guardianName.toLowerCase().includes(lower) ||
        s.surName.toLowerCase().includes(lower) ||
        s.phone?.toLowerCase().includes(lower);

      return matchesClass && matchesStatus && matchesSearch;
    });
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  /*
    toggleFeeStatus(fee: Fee) {
      if (fee.status === 'unpaid') fee.status = 'paid';
      else if (fee.status === 'paid') fee.status = 'unpaid';
      else if (fee.status === 'fi-sabilillah') fee.status = 'paid';
    }

    selectAll: boolean = false;

    /!* toggleAllSelection() {
      (this.filteredStudents() as SelectableStudent[]).forEach((s: SelectableStudent) => (s.selected = s.selectAll));
    } *!/

    bulkUpdateStatus(status: 'paid' | 'unpaid') {
      (this.filteredStudents() as SelectableStudent[]).forEach(s => {
        if (s.selected) s.status = status;
      });
    }

    notifyParents() {
      const selectedStudents = (this.filteredStudents() as SelectableStudent[])
        .filter((s: SelectableStudent) => s.selected)
        .map((s: Student) => s.name);
      if (selectedStudents.length === 0) {
        alert('Please select at least one student.');
        return;
      }
      alert('Notification sent to parents of: ' + selectedStudents.join(', '));
    }*/

  selectedIds = new Set<number>();

  assignFees(s: string) {

    const request: BatchFeeRequest = {
      studentIds: Array.from(this.selectedIds),
      status: s
    };

    this.feeService.assignFees(request).subscribe(
      (res: BatchFeeResponse) => {  // <-- type the response
        this.loadStudents();
      },
      (err: HttpErrorResponse) => { // <-- type the error
        console.error('Error assigning fees:', err.message);
      }
    );
  }


  toggleSelection(s: Student) {
    if (this.selectedIds.has(s.id)) {
      this.selectedIds.delete(s.id);
    } else {
      this.selectedIds.add(s.id);
    }
  }

  getStatus(s: Student): string {
    const totalPaid = this.calculateTotalFeesPaid(s);
    const totalPending = this.calculateTotalFeesPending(s);
    return totalPaid - totalPending < 0 ? "DUE" : "PAID";
  }

  /*
  calculateTotalPaid(student: Student): number {
    return (student.fees || [])
      .filter(f => f.status && f.status.toUpperCase() === 'PAID')
      .reduce((sum, f) => sum + (Number(f.paidAmount) || Number(f.paidAmount) || 0), 0);
  }*/
  calculateTotalFeesPaid(student: Student): number {
    return student.fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  }

  calculateTotalFeesPaidAllStudents(): number {
    let totalSum = 0;
    this.students.forEach(student => {
      totalSum += this.calculateTotalFeesPaid(student);
    })
    return totalSum;
  }

  calculateTotalFeesPendingAllStudents(): number {
    let totalSum = 0;
    this.students.forEach(student => {
      totalSum += this.calculateTotalFeesPending(student);
    })
    return totalSum;
  }

  calculateTotalFeesPending(student: Student): number {
    const months = this.feeService.getMonthsPassed(student.admissionDate);
    const monthlyFee = 300;
    return (months * monthlyFee) - this.calculateTotalFeesPaid(student)<0?0:(months * monthlyFee) - this.calculateTotalFeesPaid(student);
  }

  bulkNotifyParents() {
    const payload = {};
    this.http.post('/api/notify/whatsapp', payload).subscribe({
      next: () => alert('WhatsApp notification queued!'),
      error: (e: HttpErrorResponse) => alert('Failed to send WhatsApp notification')
    });
  }
}
