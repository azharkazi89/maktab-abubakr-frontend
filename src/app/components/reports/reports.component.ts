import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from '@angular/forms';
import {BackButtonDirective} from "../commons/back-button.directive";
import {ColumnConfig, Fee, MaktabClass, ReportRow, Student} from "../models/all.models";
import {HttpErrorResponse} from "@angular/common/http";
import {ClassService} from "../classes/class.service";
import {FeeService} from "../fees/fees.service";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonDirective, RouterLink]
})
export class ReportsComponent implements OnInit {
  constructor(private router: Router, private classService: ClassService, private feesService: FeeService) {
  }
  selectColumns: boolean;
  selectedReport = 'attendance';
  selectedClass = '';
  selectedMonth: string = '';
  classes: MaktabClass[] = [];
  reportTitle = '';
  tableColumns: string[] = [];
  reportData: ReportRow[] = [];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];
  selectedStatus: string = '';
  columns: ColumnConfig[] = [
    { key: 'id',     header: 'ID',       selected: false },
    { key: 'studentFullName',     header: 'Student Name',       selected: true },
    { key: 'className',  header: 'Class Name',    selected: true },
    { key: 'phone',     header: 'Contact No.',       selected: true },
    { key: 'month',  header: 'Month',    selected: true },
    { key: 'status', header: 'Status',   selected: true },
    { key: 'paidAmount', header: 'Total Paid',   selected: true },
    { key: 'dueAmount', header: 'Balance',   selected: true },
    { key: 'remark', header: 'Remark',   selected: true },
  ];
  ngOnInit(): void {
    this.loadClasses();
    this.loadReport();
  }

  loadReport() {
    if (this.selectedReport === 'attendance') {
      this.reportTitle = 'Attendance Report';
      this.tableColumns = ['Student', 'Present Days', 'Absent Days'];
    } else if (this.selectedReport === 'fees') {
      /*if(this.selectedMonth === '') {
        alert('Please select a month for the Fees Report.');
        return;
      }*/
      this.reportTitle = 'Fees Report';
      this.tableColumns = this.columns
        //.filter(col => col.selected)
        .map(col => col.header);
      const searchParams = {
        className: this.selectedClass,
        month: this.selectedMonth,
        status: this.selectedStatus
      };
      this.feesService.searchFees(searchParams).subscribe(fees => {
        this.reportData = fees;
      });
    }
    // Add more report types as needed
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

  filteredReportData() : ReportRow[] {
    this.reportData = this.reportData.filter((f: ReportRow) => {
      return (f.status.toLowerCase() === this.selectedStatus.toLowerCase() || this.selectedStatus === '')
        && (f.month.toLowerCase() === this.selectedMonth.toLowerCase() || this.selectedMonth === '')
        ;
    });
    return this.reportData;
  }
  exportSelectedColumnsToExcel(): void {
    const selectedColumns = this.columns.filter(c => c.selected);

    if (selectedColumns.length === 0) {
      alert('Please select at least one column.');
      return;
    }

    const rows = this.filteredReportData();

    // Build array of JSON objects with only selected columns
    const exportData = this.reportData.map((row, index) => {
      const obj: any = {};
      selectedColumns.forEach(col => {
        if (col.key === 'index') {
          obj[col.header] = index + 1;
        } else {
          obj[col.header] = (row as any)[col.key];
        }
      });
      return obj;
    });

    // Convert to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook and add the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    const fileName = this.reportTitle+`_`+this.selectedMonth+`_`+this.selectedStatus
      +`_`+new Date().toDateString()+`.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }
  downloadReport(): void {
    this.selectColumns= true;

  }
}
