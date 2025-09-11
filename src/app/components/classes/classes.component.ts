import {Component, OnInit} from '@angular/core';
import {ClassService} from './class.service'; // correct path
import {MaktabClass} from '../models/all.models';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SubjectService} from "../subjects/subjects.service";
import {TeacherService} from "../teachers/teachers.service";
import {StudentService} from "../students/students.service";
import {BackButtonDirective} from "../commons/back-button.directive"; // correct path

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BackButtonDirective]
})
export class ClassesComponent implements OnInit {

  classes: MaktabClass[] = [];
  isModalOpen = false;

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private classService: ClassService,
    private fb: FormBuilder
  ) {
    this.classForm = this.fb.group({
      name: ['', Validators.required],
      division: ['', Validators.required],
      timing: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classService.getAll().subscribe((data: MaktabClass[]) => {
      this.classes = data;
    }, (error: any) => {
      console.error('Error fetching classes', error);
    });
  }

  modalType: 'teachers' | 'subjects' | 'students' | null = null;
  selectedClassId: number | null = null;

  // Data to display in modal
  modalData: any[] = [];
  classForm!: FormGroup;
  modalMode: 'add' | 'edit' = 'add';
  editingClassId: number | null = null;
  isClassModalOpen = false;

  openModal(type: 'teachers' | 'subjects' | 'students', classId: number) {
    this.modalType = type;
    this.selectedClassId = classId;
    this.modalData = []; // Reset previous data
    this.isModalOpen = true;

    switch (type) {
      case 'teachers':
        this.teacherService.getTeachersByClass(classId).subscribe(data => {
            this.modalData = data
          }
        );
        break;
      case 'subjects':
        this.subjectService.getSubjectsByClass(classId).subscribe(data => this.modalData = data);
        break;
      case 'students':
        this.studentService.getStudentsByClass(classId).subscribe(data => this.modalData = data);
        break;
    }
  }

  closeModal() {
    this.modalType = null;
    this.selectedClassId = null;
    this.modalData = [];
    this.isModalOpen = false;
  }

  openClassModal(mode: 'add' | 'edit', classData?: any) {
    this.modalMode = mode;
    this.isClassModalOpen = true;

    if (mode === 'edit' && classData) {
      this.editingClassId = classData.id;
      this.classForm.patchValue({
        name: classData.name,
        division: classData.division,
        timing: classData.timing,
      });
    } else {
      this.editingClassId = null;
      this.classForm.reset();
    }
  }

  closeClassModal() {
    this.isClassModalOpen = false;
  }

  saveClass() {
    if (this.classForm.invalid) return;

    const formData = this.classForm.value;

    if (this.modalMode === 'add') {
     this.classService.create(this.classForm.value).subscribe(value => {
       this.loadClasses();
     });

    } else if (this.modalMode === 'edit' && this.editingClassId) {
      this.classService.update(this.editingClassId, this.classForm.value).subscribe(value => {
        this.loadClasses();
      });
      const idx = this.classes.findIndex(c => c.id === this.editingClassId);
      if (idx > -1) {
        this.classes[idx] = {...this.classes[idx], ...formData};
      }
    }

    this.closeClassModal();
  }
}
