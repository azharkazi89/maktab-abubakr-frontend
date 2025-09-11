import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';

// Students
import { StudentListComponent } from './components/students/students.component';
import { StudentDetailsComponent } from './components/students/student-details.component';
// Teachers
import { TeacherComponent } from './components/teachers/teachers.component';
//import { TeacherFormComponent } from './components/teachers/teacher-form/teacher-form.component';

// Classes
import { ClassesComponent } from './components/classes/classes.component';
//import { ClassFormComponent } from './components/classes/class-form/class-form.component';

// Subjects
import { SubjectComponent } from './components/subjects/subjects.component';
//import { SubjectFormComponent } from './components/subjects/subject-form/subject-form.component';

import { AttendanceCalendarComponent } from './components/attendance/attendance-calendar.component';
import { StudentAttendanceDetailsComponent } from './components/attendance/student-attendance-details.component';

//import { AttendanceFormComponent } from './components/attendance/attendance-form/attendance-form.component';

// Fees
import { FeesComponent } from './components/fees/fees.component';
import { StudentFeeDetailsComponent } from './components/fees/fee-details.component';

// Reports
import { ReportsComponent } from './components/reports/reports.component';

import { UploadComponent } from './components/upload/upload.component';
import {AppComponent} from "./app.component";
import {BackButtonDirective} from "./components/commons/back-button.directive";

@NgModule({
  declarations: [
  ],
  imports: [
    AppComponent,
    BackButtonDirective,
    UploadComponent,
    ReportsComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    // Students
    StudentListComponent,
    StudentDetailsComponent,
    // Teachers
    TeacherComponent,
    // TeacherFormComponent,

    // Classes
    ClassesComponent,
    //  ClassFormComponent,

    // Subjects
    SubjectComponent,
    AttendanceCalendarComponent,
    StudentAttendanceDetailsComponent,

    // Fees
    FeesComponent,
    StudentFeeDetailsComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
