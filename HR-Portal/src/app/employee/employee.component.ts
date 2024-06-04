import { HttpClient } from '@angular/common/http';
import { Component, Input, input } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent {
  //Variables
  dateOfJoining: string;
  confirmDate: string;
  publicUserID: number;
  @Input() showEmplyeeOverview: false;
  @Input() showEmployeeJoining: false;
  @Input() showEmployeeAddressAndContacts: false;
  @Input() showEmployeeAttendanceAndLeaves: false;
  @Input() showAttendanceAndLeaves: false;

  if(showAttendanceAndLeaves) {
    this.BindEmployeeLeavesDetails(this.publicUserID);
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.employeeOverviewForm = this.fb.group({
      firstName: '',
      lastName: '',
      fullName: [{ value: '', disabled: true }],
      dateOfJoining: [{ value: '', disabled: true }],
      isActive: [{ value: '', disabled: true }],
      userID: 0,
    });

    this.employeeAddressAndContactForm = fb.group({
      userID: 0,
      phoneNumber: '',
      email: '',
      companyEmail: [{ value: '', disabled: true }],
      countryName: [{ value: '', disabled: true }],
      regionName: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    // Use ngOnInit to access the inputs
    this.route.queryParams.subscribe((params) => {
      let userID = params['userID'];
      this.bindEmployeeData(userID);
      this.BindEmployeeLeavesDetails(userID);
      this.publicUserID = userID;
    });
  }

  ngOnChanges() {
    this.route.queryParams.subscribe((params) => {
      let userID = params['userID'];
      this.BindEmployeeLeavesDetails(userID);
    });
  }
  bindEmployeeData(data: any) {
    let url = `${'https://localhost:44359/api/HRPortal/GetUserDetailsByUserID'}?userID=${data}`;
    this.http.get(url).subscribe((data: any) => {
      (this.dateOfJoining = this.formatDate(data.dateOfJoining)),
        (this.confirmDate = this.formatDate(data.confirmDate));
      this.employeeOverviewForm.patchValue({
        userID: data.userID,
        firstName: data.first_name,
        lastName: data.last_name,
        fullName: data.fullName,
        dateOfJoining: this.formatDate(data.dateOfJoining),
        isActive: data.isActive == true ? 'Active' : 'InActive',
      });

      this.employeeAddressAndContactForm.patchValue({
        phoneNumber: data.phone_number,
        email: data.email,
        companyEmail: data.userName,
        countryName: data.country_name,
        regionName: data.region_name,
        userID: data.userID,
      });
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [month, day, year].join('-');
  }

  //Employee Overview
  employeeOverviewForm: FormGroup;

  overViewFormValues: {
    firstName: string;
    lastName: string;
    userID: number;
  } = {
    firstName: '',
    lastName: '',
    userID: 0,
  };

  onClickSaveEmployeeOverview() {
    this.overViewFormValues = this.employeeOverviewForm.value;
    if (
      this.overViewFormValues.firstName.trim() != '' &&
      this.overViewFormValues.lastName.trim() != ''
    ) {
      const headers = { 'Content-Type': 'application/json' };
      let url = `${'https://localhost:44359/api/HRPortal/UpdateOverView'}`;
      this.http
        .post(url, this.overViewFormValues, { headers })
        .subscribe((data: any) => {
          if (data != null && data != 'Success') {
            alert(data);
          } else {
            this.employeeOverviewForm.reset();
          }
        });
    } else {
      alert('First Name and Last Name cannot be empty!!');
    }
  }

  //Employee Address and Contact
  employeeAddressAndContactForm: FormGroup;
  employeAddressAndContactFormValues: {
    phoneNumber: string;
    email: string;
    userID: number;
  } = {
    phoneNumber: '',
    email: '',
    userID: 0,
  };
  onClickEmployeeAddressAndContact() {
    debugger;
    this.employeAddressAndContactFormValues =
      this.employeeAddressAndContactForm.value;

    if (
      this.employeAddressAndContactFormValues.phoneNumber.trim() != '' &&
      this.employeAddressAndContactFormValues.email.trim() != ''
    ) {
      let url = `${'https://localhost:44359/api/HRPortal/UpdateEmployeeAddressAndContact'}`;
      let headers = { 'Content-Type': 'application/json' };
      this.http
        .post(url, this.employeAddressAndContactFormValues, { headers })
        .subscribe((data: any) => {
          if (data != '' && data != 'Success') {
            alert(data);
          } else {
            this.employeeAddressAndContactForm.reset();
          }
        });
    }
  }

  BindEmployeeLeavesDetails(data: any) {
    let url = `${'https://localhost:44359/api/HRPortal/GetleavesDetailsByUsersID'}?userID=${data}`;

    this.http.get(url).subscribe((data: any) => {
      debugger;
      console.log(data);
      if (data != null && data != undefined) {
        const tableBody = document.querySelector('#leaveDetailsTable tbody');
        tableBody.innerHTML = ''; // Clear existing table data

        if (data[0].leavesAllocated == 24) {
          const row = document.createElement('tr');
          const cell = document.createElement('td');
          cell.setAttribute('colspan', '10'); // Assuming there are 10 columns
          cell.textContent = 'You do not have any pending leaves!!';
          cell.style.textAlign = 'center';

          row.appendChild(cell);
          tableBody.appendChild(row);
        } else {
          data.forEach((item) => {
            const row = document.createElement('tr');

            row.innerHTML = `
            <td data-label="Leave Type ID">${item.leave_type_id}</td>
            <td data-label="Leave Status ID">${item.leave_status_id}</td>
            <td data-label="Approver ID">${item.approver_id}</td>
            <td data-label="Submission Date">${new Date(
              item.submissiondate
            ).toLocaleDateString()}</td>
            <td data-label="Approval Date">${new Date(
              item.approvaldate
            ).toLocaleDateString()}</td>
            <td data-label="User Comment">${item.user_comment}</td>
            <td data-label="Approver Comment">${item.approver_comment}</td>
            <td data-label="Leave From">${new Date(
              item.leave_from
            ).toLocaleDateString()}</td>
            <td data-label="Leave To">${new Date(
              item.leave_to
            ).toLocaleDateString()}</td>
            <td data-label="Leave Span">${item.leave_span}</td>
          `;

            tableBody.appendChild(row);
          });
        }
      }
    });
  }
}
