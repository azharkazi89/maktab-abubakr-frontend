import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaktabClass } from '../models/all.models';
import { API_BASE } from '../_api-base';

@Injectable({ providedIn: 'root' })
export class MaktabClassService {
  private baseUrl = `${API_BASE}` + `/class/`;

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<MaktabClass[]> {
    return this.http.get<MaktabClass[]>(this.baseUrl);
  }
}

