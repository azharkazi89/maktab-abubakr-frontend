import { Component } from '@angular/core';
import { WhatsappService } from './whatsapp.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  imports: [
    FormsModule
  ]
})
export class SendMessageComponent {

  chatId: string = '';
  text: string = '';

  constructor(private whatsappService: WhatsappService) {}

  send() {
    this.whatsappService.sendMessage("default", this.chatId, this.text)
      .subscribe({
        next: (res) => console.log("✔ Message Sent:", res),
        error: (err) => console.error("❌ Error:", err)
      });
  }
}
