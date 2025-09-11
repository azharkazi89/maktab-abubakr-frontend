import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TeacherService} from './teachers.service';
import {MaktabClass, Teacher} from '../models/all.models';
import {CommonModule} from '@angular/common';
import {ClassService} from "../classes/class.service";
import {BackButtonDirective} from "../commons/back-button.directive";

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButtonDirective]
})
export class TeacherComponent implements OnInit {
  teachers: Teacher[] = [];
  isTeacherModalOpen = false;
  teacherModalMode: 'add' | 'edit' = 'add';
  teacherForm!: FormGroup;
  selectedTeacherId: number | null = null;
  classes: MaktabClass[] = [];

  constructor(private classService: ClassService, private teacherService: TeacherService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.loadClasses();
    this.loadTeachers();
    this.initForm();
  }

  loadClasses() {
    this.classService.getAll().subscribe(value => {
      this.classes = value;
    });
  }

  loadTeachers(): void {
    this.teacherService.getAll().subscribe(data => {
      this.teachers = data;
    });
  }

  initForm(): void {
    this.teacherForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      maktabClass: ['', Validators.required]
    });
  }

  openTeacherModal(mode: 'add' | 'edit', teacher?: Teacher) {
    this.teacherModalMode = mode;
    this.isTeacherModalOpen = true;

    if (mode === 'edit' && teacher) {
      this.selectedTeacherId = teacher.id!;
      this.teacherForm.patchValue({
        fullName: teacher.fullName,
        phone: teacher.phone,
        maktabClass: teacher.maktabClass
      });
    } else {
      this.teacherForm.reset();
      this.selectedTeacherId = null;
    }
  }

  closeTeacherModal() {
    this.isTeacherModalOpen = false;
    this.teacherForm.reset();
  }

  saveTeacher() {
    if (this.teacherForm.invalid) return;

    const teacherData = this.teacherForm.value;

    if (this.teacherModalMode === 'add') {
      this.teacherService.create(teacherData).subscribe(() => {
        this.loadTeachers();
        this.loadClasses();
      });
    } else if (this.teacherModalMode === 'edit' && this.selectedTeacherId) {
      this.teacherService.update(this.selectedTeacherId, teacherData).subscribe(() => {
        this.loadTeachers();
        this.loadClasses();
      });
    }

    this.closeTeacherModal();
  }
}
