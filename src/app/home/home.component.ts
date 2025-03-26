import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { SharedDataService } from '../shared-data.service';
import { ObsService } from '../service/obs.service';
import { environment } from '../../environments/environment'
import { switchMap, throwError } from 'rxjs';
import * as XLSX from 'xlsx';

interface LogoutResponse {
  headers: any;
  body: {
    msg: string;
    token: string;
  };
  statusCode: string;
  statusCodeValue: number;
}

interface TransferResponse {
  headers: any;
  body: {
    msg: string;
    data: string;
    obj: string;
  };
  statusCode: string;
  statusCodeValue: number;
}

interface billsHistory {
  id?: any;
  employeeName?: string;
  serviceName?:string;
  dor?:any;
  amount?:any;
  userCharges?:any;
  totalAmount?:any;
  givenAmountByCustomer?:any;
  refundAmountToCustomer?:any;
  cashLessTransaction?:any;
  custAmountPendingForUs?:any;
  createdDate?:any;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  formSubmitted = false;
  ///serviceUrl = environment.baseUrl1;
  serviceUrl = environment.baseUrl;
  //serviceCodes: string[] = ["Service 1", "Service 2", "Service 3", "Service 4", "Service 5", "Service 6"];
  serviceCodes: { serviceCode: string, id: number }[] = [];
  serviceNames: string[] = [];

  constructor(
    private obsService: ObsService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private sharedDataService: SharedDataService
  ) {

    this.username = localStorage.getItem('userName') ?? '';
    this.userId = localStorage.getItem('userId') ?? '';
    this.denominations.forEach(denomination => {
      this.counts[denomination] = 0;
      this.amounts[denomination] = 0; // Initialize amounts to 0 as well
    });

  }
  bearerToken: string = '';
  currentUserRole: string = '';
  currentPage = 1; // Current page number
  itemsPerPage = 5;
  username: string = '';
  role: string = '';
  email: string = '';
  custId: string = '';
  userId: any;
  mobileNumber: string = '';
  roleName: any;
  loginTime: string = '';
  currentTab: string = 'items';
  selectedTransactionType: string = '';
  selectedPaymentType: string = '';
  selectedServiceCode: any;
  showHistory: boolean = false;
  finalBills : billsHistory[] =[];
  bills :  billsHistory[] =[];
  newItem: any = {};
  accountTypes: any[] = [];
  msg: string = '';
  searchText = '';
  reportSubmissionDateFilter: string = '';
  loanPay: any = {};
  billData: any[] = [];
  accounts: any[] = [
    {
      accountNumber: localStorage.getItem('accNo') ?? '',
      branchName: localStorage.getItem('branchName') ?? '',
      name: localStorage.getItem('userName') ?? '',
      balance: localStorage.getItem('balance') ?? ''
    },
    // Add more account details here
  ];
  showNewAccountForm: boolean = false;
  newAccount: any = {
    accountType: '',
    branch: '',
    name: '',
    initialDeposit: 0
  };

  showProfileDetails: boolean = false;
  hideProfileDetails() {
    this.showProfileDetails = false;
  }
  ngOnInit() {

    this.loginTime = this.obsService.getLoginTime();
    this.getAllDigitalServices();
    
    this.refreshData();
   // this.listOfLoans();
    this.viewTransactionHistory()

    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (this.currentTab === 'items') {
      this.obsService.getAccountInfo(); // Refresh account summary data
    }
          
  }

  openNewAccountForm() {
    this.redirectToNewAccountPage();
  }
  openNewDigitalServiceForm() {
    this.redirectToNewDigitalServicePage();
  }
  hideNewAccountForm() {
    this.showNewAccountForm = false;
  }
  submitNewAccountForm() {

  }



  selectTab(tabName: string) {
    this.currentTab = tabName;

  }
  async refreshData() {
    await this.obsService.getAccountInfo();
  }

  // onLoanTypeChange() {
  //   if (this.selectedLoanType === 'loanList') {
  //     this.listOfLoans();
  //   }
  // }
  async viewUserProfileDetails() {
    const loginName = localStorage.getItem('loginName') ?? '';
    this.http.get<any>(this.serviceUrl + `user/getUserByName?userName=${encodeURIComponent(loginName)}`).subscribe(
      response => {
        if (response.statusCodeValue === 200) {
          this.username = response.body.name;
          this.role = response.body.role;
          this.showProfileDetails = true;

        }

      },
      error => {
        // Handle login error
        if (error.status === 400) {
          if (error.error && error.error.responseMsg) {
            this.displayErrorMessage(error.error.responseMsg, 'red');
          } else {
            this.displayErrorMessage('Unauthorized: Invalid email', 'red');
          }
        } else if (error.status === 404) {
          this.displayErrorMessage('Not Found: API endpoint not found', 'red');
        } else {
          this.displayErrorMessage('An error occurred. Please try again later.', 'red');
        }
      }
    );
  }


  // loanApplication: any = {
  //   associatedAccount: '',
  //   loanAmount: null,
  //   interestRate: null,
  //   termLength: null,
  //   emiPerMonth: null,
  // };

  // applyForLoan(loanApplyForm: NgForm) {
  //   const loanData = {
  //     acnumber: this.loanApplication.associatedAccount,
  //     loan_amount: this.loanApplication.loanAmount,
  //     intrest: this.loanApplication.interestRate,
  //     ltenure: this.loanApplication.termLength * 12,
  //     lemi: this.loanApplication.emiPerMonth,
  //     custid: localStorage.getItem('custId') ?? '',
  //     status: 'open',
  //     bid: localStorage.getItem('branchId') ?? ''
  //   };
  //   console.log('loan data', loanData);
  //   this.http.post<LoanApplyResponse>(this.serviceUrl + 'loan/applyLoan', loanData)
  //     .subscribe(
  //       response => {

  //         if (response.statusCodeValue === 201) {
  //           this.displayLoanSuccessMessage(response.body.message, response.body.obj.loanId);
  //           // You can also reset the form here if needed
  //           loanApplyForm.reset();
  //           this.redirectTabAfterTransfer = 'loans';
  //           this.selectTab(this.redirectTabAfterTransfer);
  //         }
  //       },
  //       error => {
  //         // Handle error
  //         console.error('Error submitting loan application', error);
  //       }
  //     );
  // }

  // clearLoanApplyForm() {
  //   this.loanApplication = {
  //     associatedAccount: '',
  //     loanAmount: null,
  //     interestRate: null,
  //     termLength: null,
  //     emiPerMonth: null,
  //   };
  // }

  // listOfLoans() {
  //   const custId = localStorage.getItem('custId');

  //   fetch(this.serviceUrl + `loan/getloans/${custId}`)
  //     .then(response => response.json())
  //     .then((data: any) => {
  //       if (data.statusCodeValue === 201) {
  //         const loansList = (data.body.obj as Array<any>).map(loans => ({
  //           loanId: loans.loanId,
  //           loanAmount: loans.loan_amount,
  //           loanEmi: loans.loanEmi,
  //           loanInterest: loans.interest,
  //           laonTenure: loans.loanTenure,
  //           loanStatus: loans.status
  //         }));
  //         this.loanHistory = loansList;
  //       } else {
  //         console.error("Error fetching transaction history:", data.responseMsg);
  //       }
  //     })
  //     .catch(error => {
  //       console.error("Error fetching transaction history:", error);
  //     });

  // }
  // closeLoan(loanId: number) {
  //   this.http.put<any>(this.serviceUrl + `loan/closeloan/${loanId}`, {}).subscribe(
  //     response => {
  //       if (response.statusCodeValue === 201) {
  //         this.listOfLoans();
  //       }
  //     }
  //   );
  // }

  viewTransactionHistory() {

    this.showHistory = true;

    const userId = localStorage.getItem('userId');
    const bearerToken = localStorage.getItem('token');
    this.roleName = localStorage.getItem('role')
    if (!bearerToken) {
      this.displayErrorMessage('Authentication token is missing. Please log in again.', 'red');
      return;
    }
    let finalUserId = userId;

    if (this.roleName.toUpperCase() === 'ADMIN') {
      console.log("Role is ADMIN");
      finalUserId = '0'; 
    }
    const headers = {
      'Authorization': `Bearer ${bearerToken}`
    };
    fetch(this.serviceUrl + `bills/getBillsById?userId=${finalUserId}`, {
      headers: headers
    })
      .then(response => response.json())
      .then((data: any) => {
        // if (data.statusCode === "OK") {
        
          const transactions = (data as Array<any>).map(transaction => ({
            id: transaction.id,
            employeeName:  transaction.userId ? transaction.userId.name : '',
            serviceName: transaction.serviceName || '',
            dor: transaction.dor ? transaction.dor.substring(0, 10) : '',
            amount: transaction.amount || 0,
            userCharges: transaction.userCharges || 0,
            totalAmount: transaction.totalAmount || 0,
            givenAmountByCustomer: transaction.givenAmountByCustomer || 0,
            refundAmountToCustomer: transaction.refundAmountToCustomer || 0,
            cashLessTransaction: transaction.cashLessTransaction || '',
            custAmountPendingForUs: transaction.custAmountPendingForUs || 0,
            createdDate:transaction.createdDate ? transaction.createdDate.substring(0, 10) : ''

          }));
          transactions.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
          //transactions.reverse();
          this.bills = transactions;
          this.finalBills = transactions;

      })
      .catch(error => {
        console.error("Error fetching bill details:", error);
      });
  }

  filterServices() {
  this.bills = this.finalBills.filter((data) => {
    const nameFilter =
        !this.searchText ||
        (data?.serviceName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
            data?.employeeName?.toLowerCase().includes(this.searchText.toLowerCase()));
    const dateFilter = !this.reportSubmissionDateFilter ||
        new Date(data?.dor).toDateString() === new Date(this.reportSubmissionDateFilter).toDateString();

    return (nameFilter && dateFilter);
});
}


exportToExcel() {
  const fileName = 'transactions.xlsx';
  const header = ['S.No', 'Bill Number', 'Employee Name', 'Service Code', 'Date Of Bill created', 'Bill Amount', 'User Charges', 'Total Amount', 'Given Amount By Customer', 'Refund Amount To Customer', 'Cash Less Transaction', 'Customer Amount Pending For Us'];
  const data = [header, ...this.bills.map((transaction, index) => [
      index + 1,
      transaction.id,
      transaction.employeeName,
      transaction.serviceName,
      transaction.dor,
      transaction.amount,
      transaction.userCharges,
      transaction.totalAmount,
      transaction.givenAmountByCustomer,
      transaction.refundAmountToCustomer,
      transaction.cashLessTransaction,
      transaction.custAmountPendingForUs
  ])];
  const totalRow = ['', '', '', '', '', 0, 0, 0, 0, 0, 0, 0];
  this.bills.forEach(transaction => {
      totalRow[5] += transaction.amount || 0; // Bill Amount
      totalRow[6] += transaction.userCharges || 0; // User Charges
      totalRow[7] += transaction.totalAmount || 0; // Total Amount
      totalRow[8] += transaction.givenAmountByCustomer || 0; // Given Amount By Customer
      totalRow[9] += transaction.refundAmountToCustomer || 0; // Refund Amount To Customer
     
  });

  // Add total row to data array
  data.push(totalRow);
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  // const totalRowRange = XLSX.utils.decode_range(XLSX.utils.encode_cell({ r: data.length - 1, c: 0 }) + ":" + XLSX.utils.encode_cell({ r: data.length - 1, c: totalRow.length - 1 }));
  // for (let i = totalRowRange.s.r; i <= totalRowRange.e.r; ++i) {
  //     for (let j = totalRowRange.s.c; j <= totalRowRange.e.c; ++j) {
  //         const cell = XLSX.utils.encode_cell({ r: i, c: j });
  //         ws[cell].s = { fill: { bgColor: { rgb: "FFFF00" } } }; // Set background color to yellow for the total row
  //     }
  // }
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
  XLSX.writeFile(wb, fileName);
}
getAllDigitalServices() {
  this.http.get<any[]>(this.serviceUrl + 'digitalServices/all').subscribe(
    (response: any[]) => {
      if (response && response.length > 0) {
        this.serviceCodes = response.map((item: any) => ({
          // serviceCode: `${item.serviceCode}-${item.serviceName}`,
          serviceCode: `${item.serviceName}`,
          id: item.id
        }));
        this.selectedServiceCode = this.serviceCodes[0].id;
        this.serviceNames = this.serviceCodes.map(code => code.serviceCode);
        this.viewDepositList({  serviceNames: this.serviceNames }, this.userId);
      }
    },
    error => {
      console.error('Error fetching digital services:', error);
    }
  );
}



  clearForm(newItemForm: NgForm) {
    /// transferForm.reset();
    this.newItem = {
      employeeName: '',
      serviceName: '',
      dor: null,
      amount: null,
      userCharges: null,
      totalAmount: null,
      givenAmountByCustomer: null,
      refundAmountToCustomer: null,
      cashLessTransaction: '',
      custAmountPendingForUs: null,
    }; // Reset the transfer object as well
  }
  updateTotalAmount() {
    const amount = parseFloat(this.newItem.amount) || 0;
    const userCharges = parseFloat(this.newItem.userCharges) || 0;
    this.newItem.totalAmount = amount + userCharges;
    this.updateRefundAmount(); // Update refund amount whenever total amount changes
  }

  updateRefundAmount() {
    const totalAmount = parseFloat(this.newItem.totalAmount) || 0;
    const givenAmountByCustomer = parseFloat(this.newItem.givenAmountByCustomer) || 0;
    this.newItem.refundAmountToCustomer = givenAmountByCustomer - totalAmount;
  }
  addNewBill(newItemForm: any) {
    this.formSubmitted = true;

    if (newItemForm.invalid) {
      this.markFormGroupTouched(newItemForm);
      this.displayErrorMessage('All fields marked with * are mandatory.', 'red');
      return;
    }
    const newItem = {
      employeeName: this.username,
      serviceCode: this.newItem.serviceCode,
      dor: this.newItem.dor,
      amount: this.newItem.amount,
      userCharges: this.newItem.userCharges,
      totalAmount: this.newItem.totalAmount,
      givenAmountByCustomer: this.newItem.givenAmountByCustomer,
      refundAmountToCustomer: this.newItem.refundAmountToCustomer,
      cashLessTransaction: this.newItem.cashLessTransaction,
      custAmountPendingForUs: this.newItem.custAmountPendingForUs,
      userId: localStorage.getItem('userId') ?? ''
    };

    const bearerToken = localStorage.getItem('token');

    if (!bearerToken) {
      this.displayErrorMessage('Authentication token is missing. Please log in again.', 'red');
      return;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${bearerToken}'
    });
    this.http.post<TransferResponse>(this.serviceUrl + 'bills/create', newItem, { headers }).subscribe(
      (response) => {
        if (response.statusCodeValue === 201) {
          this.msg = response.body.msg + "----" + response.body.data;
          this.displaySuccessMessage(this.msg);
          this.refreshData();
          this.clearForm(newItemForm);
          this.viewTransactionHistory();
          this.selectedTransactionType = 'viewItems';
          this.formSubmitted = false;
        }
      },
      (error) => {
        console.error('Order bill failed!', error.error.msg);
        if (error.status === 400) {
          if (error.error && error.error.responseMsg) {
            this.displayErrorMessage(error.error.responseMsg, 'red');
          } else {
            this.displayErrorMessage('Unauthorized: Invalid email or password', 'red');
          }
        } else if (error.status === 404) {
          this.displayErrorMessage('Not Found: API endpoint not found', 'red');
        } else {
          this.displayErrorMessage('An error occurred. Please try again later.', 'red');
        }
      }
    );

  }

  markFormGroupTouched(formGroup: any) {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.controls[key].markAsTouched();
    });
  }
  onTransactionTypeChange() {
    // Handle tab switching based on selectedTransactionType
    if (this.selectedTransactionType === 'newItem') {
      this.currentTab = 'newItem'; // or whichever tab you want to display for 'newItem'
    } else if (this.selectedTransactionType === 'viewItems') {
      this.currentTab = 'viewItems';
    }
  }
  // payNow(payform: any) {

  //   // Perform form validation
  //   if (payform && payform.invalid) {
  //     return;
  //   }
  //   const payData = {
  //     recharge_amount: this.Pay.recharge_amount,
  //     mobileNumber: this.Pay.mobileNumber,
  //   };

  //   console.log("payNow: ", payData);
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });

  //   this.http.post<PayResponse>(this.serviceUrl + 'transfer/debit', payData, { headers }).subscribe(
  //     (response) => {
  //       if (response.statusCodeValue === 200) {
  //         console.log('Registration successful!', response.body.responseMsg);
  //         this.displaySuccessMessage(response.body.responseMsg);
  //         this.Pay = {};
  //         this.mobileNumber = '';
  //         this.recharge_amount = '';
  //         this.currentTab = 'billPayRecharge';
  //         this.selectTab(this.currentTab);
  //       }
  //     },
  //     (error) => {

  //       console.error('Bill Pay failed!', error.error.responseMsg);
  //       if (error.status === 400) {
  //         if (error.error && error.error.responseMsg) {
  //           this.displayErrorMessage(error.error.responseMsg, 'red');
  //         } else {
  //           this.displayErrorMessage('Unauthorized: mobile number', 'red');
  //         }
  //       } else if (error.status === 404) {
  //         this.displayErrorMessage('Not Found: API endpoint not found', 'red');
  //       } else {
  //         this.displayErrorMessage('An error occurred. Please try again later.', 'red');
  //       }
  //       // Handle the error response from the backend API
  //       // You can display an error message or perform other actions here
  //     }
  //   );
  // }

  clearLoanForm(loanpayform: NgForm) {
    this.loanPay = {
      acnumber: '',
      lnumber: null,
      lemi: null
    };
  }

  // loan_Pay(loanpayform: any) {
  //   if (loanpayform && loanpayform.invalid) {
  //     return;
  //   }

  //   const loanpayData = {
  //     lnumber: this.loanNumber,
  //     lemi: this.EmiAmount,
  //     acnumber: this.loanApplication.associatedAccount
  //   };

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  //   this.http.post<LoanApplyResponse>(this.serviceUrl + 'loan/payment', loanpayData, { headers }).subscribe(
  //     (response) => {
  //       if (response.statusCodeValue === 201) {
  //         this.displaySuccessMessage(response.body.message);
  //         this.clearLoanForm(loanpayform);

  //         this.redirectTabAfterTransfer = 'accounts'; // Change to 'accounts' tab
  //         this.selectTab(this.redirectTabAfterTransfer);
  //       }
  //     },
  //     (error) => {
  //       console.error('Payment failed!', error.error.message);
  //       if (error.status === 400) {
  //         this.displayErrorMessage('Bad Request: ' + error.error.message, 'red');
  //       } else if (error.status === 404) {
  //         this.displayErrorMessage('Not Found: API endpoint not found', 'red');
  //       } else {
  //         this.displayErrorMessage('An error occurred. Please try again later.', 'red');
  //       }
  //     }
  //   );
  // }
  // clearCreditCardApplyForm() {
  //   this.CreditCardApplication = {
  //     pan: null,
  //     income: null,
  //   };
  // }
  // CreditCardApplication: any = {
  //   associatedAccount: '',
  //   custId: localStorage.getItem('custId') ?? '',
  //   pan: null,
  //   income: null,
  // };
  // applyForCreditCard(CreditCardApplyForm: NgForm) {
  //   const CreditCardApplication = {
  //     associatedAccount: this.CreditCardApplication.associatedAccount,
  //     custId: this.CreditCardApplication.custId,
  //     pan: this.CreditCardApplication.pan,
  //     income: this.CreditCardApplication.income,
  //     status: 'pending'
  //   };
  //   console.log('Credit card Application data', CreditCardApplication);
  //   this.http.post(this.serviceUrl + 'applycreditCard/saveCreditCardApplication', CreditCardApplication)
  //     .subscribe(
  //       response => {
  //         // Handle success
  //         console.log('Credit Card application submitted successfully', response);
  //         // You can also reset the form here if needed
  //         CreditCardApplyForm.reset();
  //       },
  //       error => {
  //         // Handle error
  //         console.error('Error submitting loan application', error);
  //       }
  //     );
  // }


  // CreditCard_Pay(creditPayform
  //   : any) {

  //   // Perform form validation
  //   if (creditPayform && creditPayform.invalid) {
  //     return;
  //   }
  //   const creditpayData = {
  //     CVV: this.creditPay.CVV,
  //     Card_Number: this.creditPay.Card_Number,
  //   };

  //   console.log("creditPay: ", creditpayData);
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  // }

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
            this.displayErrorMessage(error.error.responseMsg, 'red');
          }
        } else if (error.status === 404) {
          this.displayErrorMessage('Not Found: API endpoint not found', 'red');
        } else {
          this.displayErrorMessage('An error occurred. Please try again later.', 'red');
        }
      }
    );
  }

  redirectToLoginPage() {
    this.router.navigate(['/login']);
  }
  displaySuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      verticalPosition: 'top',
      duration: 3000, // Adjust the duration as needed
      panelClass: ['success-snackbar'] // Add custom CSS class for styling
    });
  }
  displayLoanSuccessMessage(message: string, id: number): void {
    const messageWithId = message + '\nLoan Number: ' + id;
    this.snackBar.open(messageWithId, 'Close', {
      verticalPosition: 'top',
      duration: 0, // Set duration to 0 to prevent automatic closing
      panelClass: ['success-snackbar'], // Add custom CSS class for styling
      data: { id: id } // Use data property to store the ID
    });
  }
  // displayErrorMessage(message: string, color: string) {
  //   const loginMessage = document.getElementById('loginMessage');
  //   if (loginMessage) {
  //     loginMessage.textContent = message;
  //     loginMessage.style.color = color;
  //   }
  // }
  displayErrorMessage(message: string, color: string): void {
    this.snackBar.open(message, 'Close', {
      verticalPosition: 'top',
      duration: 3000, // Same duration as displaySuccessMessage
      panelClass: color === 'red' ? ['error-snackbar'] : ['warning-snackbar'] // Custom classes based on color
    });
  }
  redirectToNewAccountPage() {
    this.router.navigate(['/account']);
  }

  redirectToNewDigitalServicePage(){
    this.router.navigate(['/digitalService']);
  }


  denominations: number[] = [1, 2, 5, 10, 20, 50, 100, 200, 500, 2000];
  counts: { [key: number]: number } = {};
  amounts: { [key: number]: number } = {};
  totalAmount: number = 0;
  serviceCode: string ='';
  // sentData: { denominations: number[], counts: { [key: number]: number }, amounts: { [key: number]: number }, totalAmount: number , serviceCode: string} | null = null;

  sentData: {  counts: { [key: number]: number },  serviceCodeId: any, userId: number, given1Total:any, given2Total:any} | null = null;

  calculateAmount(): void {
    for (const denomination of this.denominations) {
      this.amounts[denomination] = denomination * this.counts[denomination];
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = Object.values(this.amounts).reduce((acc, curr) => acc + curr, 0);
  }
  isGiven1Disabled(): boolean {
    const now = new Date();
    return now.getHours() >= 14; // Disable Given 1 after 2 PM
  }

  isGiven2Disabled(): boolean {
    const now = new Date();
    return now.getHours() < 14; // Disable Given 2 before 2 PM
  }
  sendData(buttonName: string): void {

    if (!this.newItem.serviceCode) {
      this.displayErrorMessage('Please select a service code before proceeding.', 'red');
      return; // Stop execution if serviceCode is not selected
    }

    
    if (this.totalAmount === 0) {
      this.displayErrorMessage('Please enter the amount before proceeding.', 'red');
      return; // Stop execution if serviceCode is not selected
    }

    let given1Total: any;
    let given2Total: any;

    if (buttonName === 'Given 1') {
        given1Total = this.totalAmount;
        given2Total = 0;
    } else if (buttonName === 'Given 2') {
        given1Total = 0;
        given2Total = this.totalAmount;
    }

    this.sentData = {
      serviceCodeId: this.newItem.serviceCode,
      userId: this.userId,
      counts: { ...this.counts },
      given1Total: given1Total,
      given2Total: given2Total
    };
   
    
    const bearerToken = localStorage.getItem('token');

    if (!bearerToken) {
      this.displayErrorMessage('Authentication token is missing. Please log in again.', 'red');
      return;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${bearerToken}'
    });

    this.http.post<TransferResponse>(this.serviceUrl + 'amount/create', this.sentData, { headers }).subscribe(
      (response) => {
        if (response.statusCodeValue === 201) {
          this.msg = response.body.msg + "----" + response.body.data;
          this.displaySuccessMessage(this.msg);
          this.refreshData();
          this.sentData = null;
          for (const denomination of this.denominations) {
            this.counts[denomination] = 0;
            this.amounts[denomination] = 0;
          }
          this.serviceNames = this.serviceCodes.map(code => code.serviceCode);
          this.viewDepositList({  serviceNames: this.serviceNames }, this.userId);
          this.selectedPaymentType = 'FinalAmount';

        }
      },
      (error) => {
        console.error('Registration failed!', error.error.msg);
        if (error.status === 400) {
          if (error.error && error.error.responseMsg) {
            this.displayErrorMessage(error.error.responseMsg, 'red');
          } else {
            this.displayErrorMessage('Unauthorized: Invalid email or password', 'red');
          }
        } else if (error.status === 404) {
          this.displayErrorMessage('Not Found: API endpoint not found', 'red');
        } else {
          this.displayErrorMessage('An error occurred. Please try again later.', 'red');
        }
      }
    );
    console.log(`${buttonName} clicked. Data sent.`, this.sentData);
  }

  viewDepositList(data: { serviceNames: string[] }, userId: number): void {
    const payload = { serviceNames: data.serviceNames, userId };
    const bearerToken = localStorage.getItem('token');
  
    if (!bearerToken) {
      this.displayErrorMessage('Authentication token is missing. Please log in again.', 'red');
      return;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    });

   
this.http.post<any[]>(this.serviceUrl + 'amount/getFinalAmountById', payload, { headers }).subscribe(
      (response) => {
        // Handle successful response
        console.log('Deposit list fetched:', response);
        this.billData = response;
      },
      (error) => {

        console.error('Error fetching deposit list:', error);

      }
    );
  }

  getBillData(serviceCode: string) {
    return this.billData.find(data => data.serviceName === serviceCode);
  }

}
