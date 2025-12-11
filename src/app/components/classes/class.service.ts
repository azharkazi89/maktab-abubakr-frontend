import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaktabClass } from '../models/all.models'; // adjust path
import { API_BASE } from '../_api-base';
@Injectable({
  providedIn: 'root'  // makes it globally injectable
})
export class ClassService {
   private baseUrl = `${API_BASE}`+`/class/`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<MaktabClass[]> {
    return this.http.get<MaktabClass[]>(this.baseUrl);
  }

  getById(id: number): Observable<MaktabClass> {
    return this.http.get<MaktabClass>(`${this.baseUrl}${id}`);
  }

  create(maktabClass: MaktabClass): Observable<MaktabClass> {
    return this.http.post<MaktabClass>(this.baseUrl, maktabClass);
  }

  update(id: number, maktabClass: MaktabClass): Observable<MaktabClass> {
    return this.http.put<MaktabClass>(`${this.baseUrl}${id}`, maktabClass);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}`);
  }
}
