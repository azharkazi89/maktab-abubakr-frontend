import { Component, EventEmitter, Output } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-phone-input',
  templateUrl: './phone-input.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./phone-input.component.css']
})
export class PhoneInputComponent {
  @Output() numbersChanged = new EventEmitter<string[]>();

  phones: string[] = [];
  newPhone = '';

  addPhone() {
    if (!this.newPhone.trim()) return;
    this.phones.push(this.newPhone.trim());
    this.newPhone = '';
    this.numbersChanged.emit(this.phones);
  }

  removePhone(index: number) {
    this.phones.splice(index, 1);
    this.numbersChanged.emit(this.phones);
  }
}
