import { Component, OnInit } from '@angular/core';
import { ItemsServiceService } from 'src/app/items-service.service'
import { ItemsData } from '../add-item/add-item.component';

@Component({
  selector: 'app-view-items',
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.scss']
})

export class ViewItemsComponent implements OnInit{

  formDataList: ItemsData[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 2;
  totalPages: number = 0;
  constructor(private itemService: ItemsServiceService) {}

  ngOnInit(): void {
    this.formDataList = this.itemService.getFormDataList(); 
    this.calculateTotalPages();
    console.log( this.formDataList);
  }
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.formDataList.length / this.itemsPerPage);
  }

  setPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
    }
  }

  getDisplayedItems(): ItemsData[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.formDataList.slice(startIndex, endIndex);
  }
  getSerialNumber(index: number) {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }
}
