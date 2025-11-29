import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaktabClass, Teacher, Subject, Student, StudentFeeDTO, FeeDTO} from '../models/all.models';
import { API_BASE } from '../_api-base';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private baseUrl = `${API_BASE}`+`/student/`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Student[]> { return this.http.get<Student[]>(this.baseUrl); }
  get(id: number): Observable<Student> { return this.http.get<Student>(`${this.baseUrl}${id}`); }
  create(dto: Student): Observable<Student> { return this.http.post<Student>(this.baseUrl, dto); }

  updateStudent(formData: FormData) {
    return this.http.put<Student>(this.baseUrl, formData);
  }

  uploadStudentPhoto(studentId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.baseUrl}${studentId}/upload-photo`, formData);
  }

  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}${id}/delete`); }
  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student);
  }

  getStudentsByClass(classId: number) {
    return this.http.get<Student[]>(`${this.baseUrl}${classId}/getStudentsByClass`);
  }
}
