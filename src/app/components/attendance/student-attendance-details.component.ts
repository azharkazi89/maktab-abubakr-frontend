import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceService } from './attendance.service';
import {CommonModule, Location} from '@angular/common';
import {Attendance} from "../models/all.models";
import {FormsModule} from "@angular/forms";
import {BackButtonDirective} from "../commons/back-button.directive";

@Component({
  selector: 'app-student-attendance-details',
  templateUrl: './student-attendance-details.component.html',
  styleUrls: ['./student-attendance-details.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonDirective]
})
export class StudentAttendanceDetailsComponent implements OnInit {

  studentId!: number;
  studentName!: string; // You can fetch from API or pass in state
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1; // 1-based
  attendances: Attendance[] = [];
  monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.studentName = history.state?.studentName || ''; // optional if passed in navigation
    this.loadAttendance();
  }

  loadAttendance(): void {
    this.attendanceService.getMonthlyAttendance(
      [this.studentId],
      this.currentYear,
      this.currentMonth
    ).subscribe({
      next: (data: Attendance[]) => {
        this.attendances = data;
      },
      error: (err: any) => {
        console.error('Error loading attendance', err);
      }
    });
  }

  prevMonth(): void {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadAttendance();
  }

  nextMonth(): void {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadAttendance();
  }
}
