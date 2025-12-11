import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../_api-base';
import { TeacherSalary } from '../models/all.models';

@Injectable({
  providedIn: 'root'
})
export class TeacherSalaryService {
  private apiUrl = API_BASE+`/teacher-salary`;

  constructor(private http: HttpClient) { }

  getAllSalaries(): Observable<TeacherSalary[]> {
    return this.http.get<TeacherSalary[]>(this.apiUrl);
  }

  getSalariesByTeacher(teacherId: number): Observable<TeacherSalary[]> {
    return this.http.get<TeacherSalary[]>(`${this.apiUrl}/teacher/${teacherId}`);
  }

  getPendingSalaries(): Observable<TeacherSalary[]> {
    return this.http.get<TeacherSalary[]>(`${this.apiUrl}/pending`);
  }

  createSalaryRecord(salary: Partial<TeacherSalary>): Observable<TeacherSalary> {
    return this.http.post<TeacherSalary>(this.apiUrl, salary);
  }

  updateSalaryRecord(id: number, salary: Partial<TeacherSalary>): Observable<TeacherSalary> {
    return this.http.put<TeacherSalary>(`${this.apiUrl}/${id}`, salary);
  }

  deleteSalaryRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  markSalaryAsPaid(id: number): Observable<TeacherSalary> {
    return this.http.put<TeacherSalary>(`${this.apiUrl}/${id}/mark-paid`, {});
  }

  getSalariesByDateRange(startDate: string, endDate: string): Observable<TeacherSalary[]> {
    return this.http.get<TeacherSalary[]>(`${this.apiUrl}/date-range?startDate=${startDate}&endDate=${endDate}`);
  }

  importTeacherSalariesFromExcel(file: File): Observable<TeacherSalary[]> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<TeacherSalary[]>(`${this.apiUrl}/import`, formData);
  }
}
