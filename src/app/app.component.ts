import { Component } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import {CommonModule} from "@angular/common";
import {SendMessageComponent} from "./components/whatsapp/send-message.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    SendMessageComponent
  ]
})
export class AppComponent {
  title: "Anjuman Hazrat Abu Bakr Siddique (radiallahu anhu)";
  constructor(private router: Router) {}

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
