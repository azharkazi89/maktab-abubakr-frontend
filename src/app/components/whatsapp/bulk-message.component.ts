import { Component } from '@angular/core';
import { MessagingService } from './messaging.service';
import {PhoneInputComponent} from "./phone-input.component";
import {MessageInputComponent} from "./message-input.component";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-bulk-message',
  imports: [
    PhoneInputComponent,
    MessageInputComponent,
    JsonPipe
  ],
  templateUrl: './bulk-message.component.html'
})
export class BulkMessageComponent {
  phones: string[] = [];
  message = '';
  loading = false;
  results: any;

  constructor(private messaging: MessagingService) {}

  async send() {
    this.loading = true;

    this.results = await this.messaging.sendBulk('default', this.phones, this.message);

    this.loading = false;
  }
}
