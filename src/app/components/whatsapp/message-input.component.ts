import { Component, EventEmitter, Output } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-message-input',
  imports: [
    FormsModule
  ],
  templateUrl: './message-input.component.html'
})
export class MessageInputComponent {
  @Output() messageChanged = new EventEmitter<string>();
  message = '';
}
