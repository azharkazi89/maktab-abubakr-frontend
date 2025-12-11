import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  private baseUrl = 'http://localhost:3000/api/sendText';
  private apiKey = 'YOUR_API_KEY';

  constructor(private http: HttpClient) {}

  private phoneToChatId(phone: string): string {
    const digits = phone.replace(/\D+/g, '');
    return `${digits}@c.us`;
  }

  sendMessage(session: string, phone: string, text: string) {
    const chatId = this.phoneToChatId(phone);

    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json'
    });

    return firstValueFrom(
      this.http.post(this.baseUrl, { session, chatId, text }, { headers })
    );
  }

  sendBulk(session: string, phones: string[], text: string) {
    const promises = phones.map(phone => this.sendMessage(session, phone, text));
    return Promise.allSettled(promises);
  }
}
