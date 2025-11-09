import { Routes } from '@angular/router';

// Standalone components
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentListComponent } from './components/students/students.component';
import { StudentDetailsComponent } from './components/students/student-details.component';
import {TeacherComponent} from './components/teachers/teachers.component';
import { ClassesComponent } from './components/classes/classes.component';
import { SubjectComponent } from './components/subjects/subjects.component';
import { AttendanceCalendarComponent } from './components/attendance/attendance-calendar.component';
import { StudentAttendanceDetailsComponent } from './components/attendance/student-attendance-details.component';
import { FeesComponent } from './components/fees/fees.component';
import { StudentFeeDetailsComponent } from './components/fees/fee-details.component';
import { ReportsComponent } from './components/reports/reports.component';
import { UploadComponent } from './components/upload/upload.component';
import {AdminComponent} from "./components/admin/admin.component";
import { TeacherSalaryComponent } from './components/admin/teacher-salary.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },

  // Students
  { path: 'students', component: StudentListComponent },
  { path: 'student/new', component: StudentDetailsComponent },
  { path: 'student/details/:id', component: StudentDetailsComponent },

  // Teachers
  { path: 'teachers', component: TeacherComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'teacher-salary', component: TeacherSalaryComponent },

  // Classes
  { path: 'classes', component: ClassesComponent },
  { path: 'classes/new', component: ClassesComponent },
  { path: 'classes/edit/:id', component: ClassesComponent },

  // Subjects
  { path: 'subjects', component: SubjectComponent },
  { path: 'subjects/new', component: SubjectComponent },
  { path: 'subjects/:id', component: SubjectComponent },

  // Attendance
  { path: 'attendance', component: AttendanceCalendarComponent },
  { path: 'student/:id/attendance', component: StudentAttendanceDetailsComponent },

  // Fees
  { path: 'fees', component: FeesComponent },
  { path: 'student/:id/fees', component: StudentFeeDetailsComponent },

  // Reports
  { path: 'reports', component: ReportsComponent },
  { path: 'upload', component: UploadComponent }
];
