import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ItemsComponent } from './items/items.component';
import { AmountComponent } from './amount/amount.component';
import { ViewItemsComponent } from './items/view-items/view-items.component';
import { AddItemComponent } from './items/add-item/add-item.component';
import { GivenAmountComponent } from './amount/given-amount/given-amount.component';
import { FinalAmountComponent } from './amount/final-amount/final-amount.component';
import { TotalAmountComponent } from './amount/total-amount/total-amount.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
const routes: Routes = [
  {
    path: "", redirectTo: "/items/addItem", pathMatch: "full" 
  },
  {
    path: "items", children: [
      { path: "viewItems", component: ViewItemsComponent},
      { path: "addItem", component: AddItemComponent }
    ]
  },
  {
    path: "amount",  children: [
      { path: "givenAmount", component: GivenAmountComponent},
      { path: "finalAmount", component: FinalAmountComponent },
      { path: "totalAmount", component: TotalAmountComponent }
    ]
  }
];



@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    AddItemComponent,
    ViewItemsComponent,
    AmountComponent,
    GivenAmountComponent,
    FinalAmountComponent,
    TotalAmountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(routes)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
