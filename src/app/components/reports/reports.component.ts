import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import { FormsModule } from '@angular/forms';
import {BackButtonDirective} from "../commons/back-button.directive";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonDirective]
})
export class ReportsComponent implements OnInit {
  constructor(private router: Router) {
  }
  selectedReport = 'attendance';
  selectedClass = '';
  startDate: string = '';
  endDate: string = '';
  classes: string[] = ['Nursery', '1st', '2nd', '3rd', '4th', '5th'];
  reportTitle = '';
  tableColumns: string[] = [];
  reportData: any[] = [];

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport() {
    if (this.selectedReport === 'attendance') {
      this.reportTitle = 'Attendance Report';
      this.tableColumns = ['Student', 'Present Days', 'Absent Days'];
      this.reportData = [
        { Student: 'Ali', 'Present Days': 20, 'Absent Days': 2 },
        { Student: 'Fatima', 'Present Days': 18, 'Absent Days': 4 }
      ];
    } else if (this.selectedReport === 'fees') {
      this.reportTitle = 'Fees Report';
      this.tableColumns = ['Student', 'Total Fees', 'Paid', 'Balance'];
      this.reportData = [
        { Student: 'Ali', 'Total Fees': 5000, 'Paid': 4000, 'Balance': 1000 },
        { Student: 'Fatima', 'Total Fees': 5000, 'Paid': 5000, 'Balance': 0 }
      ];
    }
    // Add more report types as needed
  }
}
