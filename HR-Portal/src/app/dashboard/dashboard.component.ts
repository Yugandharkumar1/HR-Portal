import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { FactoryTarget } from '@angular/compiler';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  userName: string;
  userID = 0;
  userDetails: {
    userID: number;
    userName: string;
    firstName: string;
    lastName: string;
    fullName: string;
    dateOfJoining: Date;
    email: string;
    isAdmin: boolean;
    phoneNumber: string;
    isActive: boolean;

    confirmDate: Date;
    country_id: string;
    country_name: string;
    region_id: number;
    region_name: string;
  } = {
    userID: 0,
    userName: '',
    firstName: '',
    lastName: '',
    fullName: '',
    dateOfJoining: new Date(),
    email: '',
    isAdmin: false,
    phoneNumber: '',
    isActive: false,
    confirmDate: new Date(),
    country_id: '',
    country_name: '',
    region_id: 0,
    region_name: '',
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      this.userID = params['userID'];
    });
    this.userName = 'Welcome!';
  }

  showEmplyeeOverview = false;
  showEmployeeJoining = false;
  showEmployeeData = false;
  showEmployeeAddressAndAccounts = false;
  showAttendanceAndLeaves = false;

  onClickOverview() {
    this.showEmployeeData = true;
    this.showEmplyeeOverview = true;
    this.showEmployeeJoining = false;
    this.showEmployeeAddressAndAccounts = false;
    this.showAttendanceAndLeaves = false;
  }

  onClickJoining() {
    this.showEmployeeJoining = true;
    this.showEmplyeeOverview = false;
    this.showEmployeeData = true;
    this.showEmployeeAddressAndAccounts = false;
    this.showAttendanceAndLeaves = false;
  }

  onClickAddressAndAccounts() {
    this.showEmployeeJoining = false;
    this.showEmplyeeOverview = false;
    this.showEmployeeData = true;
    this.showEmployeeAddressAndAccounts = true;
    this.showAttendanceAndLeaves = false;
  }

  onClickAttendanceAndLeaves() {
    this.showEmployeeJoining = false;
    this.showEmplyeeOverview = false;
    this.showEmployeeData = true;
    this.showEmployeeAddressAndAccounts = false;
    this.showAttendanceAndLeaves = true;
  }
}
