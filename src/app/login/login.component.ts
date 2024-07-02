import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedDataService } from '../shared-data.service';
import { Token } from '@angular/compiler';
import { ObsService } from '../service/obs.service';
import { environment } from '../../environments/environment'

interface LoginResponse {
  headers: any;
  body: {
    responseMsg: string;
    token: string;
  };
  statusCode: string;
  statusCodeValue: number;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userName: string = '';
  password: string = '';
  rememberMe: boolean = false;

  serviceUrl = environment.baseUrl;

private userId = '';
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar, private sharedDataService: SharedDataService,
    private service:ObsService) {}


  login() {
    const loginData = {
      userName: this.userName,
      password: this.password
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.post<LoginResponse>(this.serviceUrl + 'user/login', loginData, { headers }).subscribe(
      response => {
        if (response.statusCodeValue === 200) {
          // Handle successful login response
          this.displaySuccessMessage(response.body.responseMsg);
          this.sharedDataService.setToken(response.body.token);
          localStorage.setItem('token', response.body.token);
          this.fetchUserInfo(this.userName);
         


        }
      },
      error => {
        // Handle login error
        console.error('Login Error:', error);
        if (error.status === 400) {
          if (error.error && error.error.responseMsg) {
            this.displayLoginMessage(error.error.responseMsg, 'red');
          } else {
            this.displayLoginMessage('Unauthorized: Invalid email or password', 'red');
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

  fetchUserInfo(username: string) {
    this.http.get<any>(this.serviceUrl +`user/getUserByName?userName=${encodeURIComponent(username)}`).subscribe(
      response => {
        if (response.statusCodeValue === 200) {
          this.sharedDataService.setUsername(response.body.name);
          this.sharedDataService.setEmail(response.body.email);
          this.sharedDataService.setPhoneNumber(response.body.phoneNumber);
          ///this.sharedDataService.setUserId(response.body.userId);
          localStorage.setItem('userId' ,response.body.id);
          localStorage.setItem('userName' ,response.body.name);
          localStorage.setItem('loginName' ,response.body.userName);
          localStorage.setItem('role' ,response.body.role);


          ///this.fetchAccountDetails(response.body.userId, this.sharedDataService.getToken());
          this.service.getAccountInfo().subscribe(
            (response: any) => {
              // Handle the response here if necessary
              localStorage.setItem('accNo' ,response.body.accNumber);
              localStorage.setItem('branchName' ,response.body.branch.branchName);
              // localStorage.setItem('userName' ,response.body.cust.firstName +' ' +response.body.cust.lastName);
              localStorage.setItem('userName' ,response.body.name);
              localStorage.setItem('balance' ,response.body.openingBalance);
              localStorage.setItem('mobile' ,response.body.cust.phoneNumber );
              localStorage.setItem('custId' ,response.body.cust.custId );
              localStorage.setItem('branchId', response.body.branch.branchId)
              

              console.log(response.body.accNumber);
            },
            (error) => {
              // Handle errors here
              console.error(error);
            }
          )
          this.redirectToHomePage();
        }

      },
      error => {
        // Handle login error
        console.error('Login Error:', error);
        if (error.status === 400) {
          if (error.error && error.error.responseMsg) {
            this.displayLoginMessage(error.error.responseMsg, 'red');
          } else {
            this.displayLoginMessage('Unauthorized: Invalid email', 'red');
          }
        } else if (error.status === 404) {
          this.displayLoginMessage('Not Found: API endpoint not found', 'red');
        } else {
          this.displayLoginMessage('An error occurred. Please try again later.', 'red');
        }
      }
    );
  }


  // fetchAccountDetails(userId: string, jwtToken: string) {
  //   console.log('Token ', jwtToken);
  //  debugger
  //   const url = `http://localhost:9091/account/getAccInfoById?userId=${encodeURIComponent(userId)}`;
  //   this.http.get<any>(url).subscribe(
  //     response => {
  //       if (response.statusCodeValue === 200) {
  //         this.sharedDataService.setUsername(response.body.userName);
  //         this.sharedDataService.setEmail(response.body.email);
  //         this.sharedDataService.setPhoneNumber(response.body.phoneNumber);
  //         this.sharedDataService.setUserId(response.body.userId);

  //       }

  //     },
  //     error => {
  //       // Handle login error
  //       console.error('Login Error:', error);
  //       if (error.status === 400) {
  //         if (error.error && error.error.responseMsg) {
  //           this.displayLoginMessage(error.error.responseMsg, 'red');
  //         } else {
  //           this.displayLoginMessage('Unauthorized: Invalid email', 'red');
  //         }
  //       } else if (error.status === 404) {
  //         this.displayLoginMessage('Not Found: API endpoint not found', 'red');
  //       } else {
  //         this.displayLoginMessage('An error occurred. Please try again later.', 'red');
  //       }
  //     }
  //   );
  // }
  redirectToRegister() {
    this.router.navigate(['/register']);
  }

  redirectToHomePage() {
    this.router.navigate(['/home']);
  }
}
