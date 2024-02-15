import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ItemsServiceService } from 'src/app/items-service.service';

export interface ItemsData {
  employeeName: string;
  serviceCode: string;
  dor: string;
  billAmount: string;
  userCharges: string;
  totalAmount: string;
  givenAmountByCustomer: string;
  refundAmountToCustomer: string;
  cashLessTransaction: string;
  customerAmountPendingAmountForUs: string;
}


@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent {
  constructor(private itemService: ItemsServiceService, private router: Router) {}

  formData: ItemsData = {
    employeeName: '',
    serviceCode: '',
    dor: '',
    billAmount: '',
    userCharges: '',
    totalAmount: '',
    givenAmountByCustomer: '',
    refundAmountToCustomer: '',
    cashLessTransaction: '',
    customerAmountPendingAmountForUs: ''
  };

  save() {
    this.itemService.saveFormData(this.formData);
    this.router.navigate(['/items/viewItems']);
    console.log(this.formData); 
  }

  resetForm() {
    this.formData = {
      employeeName: '',
      serviceCode: '',
      dor: '',
      billAmount: '',
      userCharges: '',
      totalAmount: '',
      givenAmountByCustomer: '',
      refundAmountToCustomer: '',
      cashLessTransaction: '',
      customerAmountPendingAmountForUs: ''
    };
  }
}
