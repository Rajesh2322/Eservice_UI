import { Component } from '@angular/core';

@Component({
  selector: 'app-given-amount',
  templateUrl: './given-amount.component.html',
  styleUrls: ['./given-amount.component.scss']
})
export class GivenAmountComponent {

  denominations: number[] = [1, 2, 5, 10, 20, 50, 100, 200, 500, 2000];
    counts: { [key: number]: number } = {};
    amounts: { [key: number]: number } = {};
    totalAmount: number = 0;
    sentData: { denominations: number[], counts: { [key: number]: number }, amounts: { [key: number]: number }, totalAmount: number } | null = null;
    constructor() {
      // Initialize counts with 0 for each denomination
      this.denominations.forEach(denomination => {
          this.counts[denomination] = 0;
          this.amounts[denomination] = 0; // Initialize amounts to 0 as well
      });
  }

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
  this.sentData = {
      denominations: this.denominations,
      counts: { ...this.counts },
      amounts: { ...this.amounts },
      totalAmount: this.totalAmount
  };
  console.log(`${buttonName} clicked. Data sent.`);
}
}
