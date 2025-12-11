import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  private apiUrl = 'http://localhost:3000/api/sendText';

  constructor(private http: HttpClient) {}

  sendMessage(session: string, chatId: string, text: string): Observable<any> {
    const payload = { session, chatId, text };
    return this.http.post<any>(this.apiUrl, payload);
  }
}
