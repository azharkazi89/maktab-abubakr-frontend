import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Fee, BatchFeeRequest, BatchFeeResponse, StudentFeeDTO, FeeDTO, ReportRow} from '../models/all.models';
import {API_BASE} from '../_api-base';

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  private baseUrl = `${API_BASE}` + `/fee`;

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Fee[]> {
    return this.http.get<Fee[]>(this.baseUrl);
  }

  searchFees(req:any): Observable<ReportRow[]> {
    return this.http.post<ReportRow[]>(this.baseUrl+`/searchFees`, req);
  }

  create(dto: FeeDTO, id: number): Observable<Fee> { return this.http.post<Fee>(`${this.baseUrl}/${id}`, dto); }
  delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
  assignFees(request: BatchFeeRequest): Observable<BatchFeeResponse> {
      return this.http.post<BatchFeeResponse>(this.baseUrl+`/updateStudentFees`, request);
    }
  getStudentFees(id:number): Observable<StudentFeeDTO> {
    return this.http.get<StudentFeeDTO>(`${this.baseUrl}/${id}/studentFees`);
  }

  updateFee(f: FeeDTO) {
    return this.http.put<FeeDTO>(`${this.baseUrl}/updateFee`,f);
  }
  getMonthsPassed(admissionDate: string | Date): number {
    const admission = new Date(admissionDate);
    const today = new Date();

    let months = (today.getFullYear() - admission.getFullYear()) * 12;
    months += today.getMonth() - admission.getMonth();

    // if current day is before admission day → subtract 1 month
    if (today.getDate() < admission.getDate()) {
      months--;
    }

    return months < 0 ? 0 : months;
  }
}
