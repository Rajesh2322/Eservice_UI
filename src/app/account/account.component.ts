import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { SharedDataService } from '../shared-data.service';
import { environment } from '../../environments/environment'
interface LogoutResponse {
  headers: any;
  body: {
    msg: string;
    token: string;
  };
  statusCode: string;
  statusCodeValue: number;
}
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  serviceUrl = environment.baseUrl;
  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar, private sharedDataService: SharedDataService) {
    this.email = this.sharedDataService.getEmail();
    this.username = this.sharedDataService.getUsername();
    this.phoneNumber = this.sharedDataService.getPhoneNumber();
  }
  username: string = '';
  email: string = '';
  phoneNumber: string = '';
  loginTime: string = '';
  showProfileDetails: boolean = false;
  role: string = '';
  showNewAccountForm: boolean = true;
  newAccount: any = {
    accountType: '',
    branch: '',
    name: '',
    initialDeposit: 0
  };
  hideProfileDetails() {
    this.showProfileDetails = false;
  }
  ngOnInit() {

    this.updateLoginTime();
  }
  updateLoginTime() {
    setInterval(() => {
      const currentDate = new Date();
      this.loginTime = this.formatTime(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
    }, 1000);
  }

  formatTime(hours: number, minutes: number, seconds: number): string {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  }
  viewUserProfileDetails() {
    const loginName = localStorage.getItem('loginName') ?? '';
   // const url = `http://localhost:9091/user/getUserByName?username=${encodeURIComponent(this.email)}`;
    this.http.get<any>(this.serviceUrl + `user/getUserByName?userName=${encodeURIComponent(loginName)}`).subscribe(
      response => {
        if (response.statusCodeValue === 200) {
          console.log('User Info:', response.body.userName);
          this.username = response.body.name;
          this.role = response.body.role;
          this.showProfileDetails = true;
          
        }

      },
      
    );
  }
   logout() {

    this.http.post<LogoutResponse>(this.serviceUrl + 'user/logOut', {}).subscribe(
      response => {
        if (response.statusCodeValue === 200) {
          // Handle successful login response
          this.displaySuccessMessage(response.body.msg);
          this.redirectToLoginPage();
        }
      },
      error => {
        // Handle login error
        if (error.status === 400) {
          if (error.error && error.error.responseMsg) {
            this.displayLoginMessage(error.error.responseMsg, 'red');
          }
        } else if (error.status === 404) {
          this.displayLoginMessage('Not Found: API endpoint not found', 'red');
        } else {
          this.displayLoginMessage('An error occurred. Please try again later.', 'red');
        }
      }
    );
  }
  displaySuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      verticalPosition: 'top',
      duration: 3000, // Adjust the duration as needed
      panelClass: ['success-snackbar'] // Add custom CSS class for styling
    });
  }
  displayLoginMessage(message: string, color: string) {
    const loginMessage = document.getElementById('loginMessage');
    if (loginMessage) {
      loginMessage.textContent = message;
      loginMessage.style.color = color;
    }
  }
  redirectToLoginPage() {
    this.router.navigate(['/login']);
  }
  penNewAccountForm() {
    this.showNewAccountForm = true;
  }

  // Method to hide the new account form
  hideNewOfficeForm() {
    this.router.navigate(['/home']);
  }

  // Method to submit the new account form
  submitNewOfficeForm() {
    
  }
}

