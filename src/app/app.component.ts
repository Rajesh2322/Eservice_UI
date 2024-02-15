import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'E-services';

  itemsSubMenuOpen: boolean = false;
  amountSubMenuOpen: boolean = false;

  toggleSubMenu(menu: string) {
    if (menu === 'itemsSubMenu') {
      this.itemsSubMenuOpen = !this.itemsSubMenuOpen;
      this.amountSubMenuOpen = false; // Close the amount submenu if open
    } else if (menu === 'amountSubMenu') {
      this.amountSubMenuOpen = !this.amountSubMenuOpen;
      this.itemsSubMenuOpen = false; // Close the items submenu if open
    }
    // Add conditions for other submenus if needed
  }
  isSubMenuOpen(menu: string) {
    if (menu === 'itemsSubMenu') {
      return this.itemsSubMenuOpen;
    } else if (menu === 'amountSubMenu') {
      return this.amountSubMenuOpen;
    }
    // Add conditions for other submenus if needed
    return false;
  }
}
