import { Injectable } from '@angular/core';
import { ItemsData } from './items/add-item/add-item.component';

@Injectable({
  providedIn: 'root'
})
export class ItemsServiceService {
  private formDataList: ItemsData[] = [];
  constructor() { }
  saveFormData(formData: ItemsData) {
    this.formDataList.push(formData);
  }

  getFormDataList(): ItemsData[] {
    return this.formDataList;
  }
}
