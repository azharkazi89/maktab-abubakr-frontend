import {Component, OnInit} from '@angular/core';
import {StudentService} from './students.service'; // correct path
import {Student} from '../models/all.models'; // correct path
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BackButtonDirective} from "../commons/back-button.directive";
import {PaginationComponent} from "../commons/pagination.component";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BackButtonDirective, PaginationComponent]
})
export class StudentListComponent implements OnInit {

  students: Student[] = [];
  currentPage = 0;
  totalPages = 10;
  totalItems: number;
  pageSize: number = 20;
  constructor(
    private studentService: StudentService) {
  }

  ngOnInit(): void {
    this.loadData(0);
  }
  searchText: string = '';

  filteredStudents() {
    if (!this.searchText) {
      return this.students;
    }

    const lower = this.searchText.toLowerCase();

    return this.students.filter(student =>
      student.name?.toLowerCase().includes(lower) ||
      student.guardianName?.toLowerCase().includes(lower) ||
      student.surName?.toLowerCase().includes(lower) ||
      student.maktabClass?.name?.toLowerCase().includes(lower) ||
      student.phone?.toLowerCase().includes(lower)
    );
  }

  loadData(page: number): void {
    this.studentService.getAll({"page":page,"size":300}).subscribe({
      next: (data: Student[]) => {
        this.students = data;
        // Optional success message
      },
      error: (error: any) => {
        console.error('Error fetching students', error);
      }
    });
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.delete(id).subscribe(() => {
        this.students = this.students.filter(s => s.id !== id);
      }, (error: any) => {
        console.error('Error deleting student', error);

      });
    }
  }
}

