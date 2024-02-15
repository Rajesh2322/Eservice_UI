import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalAmountComponent } from './final-amount.component';

describe('FinalAmountComponent', () => {
  let component: FinalAmountComponent;
  let fixture: ComponentFixture<FinalAmountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalAmountComponent]
    });
    fixture = TestBed.createComponent(FinalAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
