import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AdminService} from './admin.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AdminComponent implements OnInit {


  constructor(private adminService: AdminService) {
  }

  ngOnInit(): void {

  }

}
