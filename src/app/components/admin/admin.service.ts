import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../_api-base';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = `${API_BASE}`+`/admin/`;
  constructor(private http: HttpClient) {}

}
