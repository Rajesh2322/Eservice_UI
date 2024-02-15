import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GivenAmountComponent } from './given-amount.component';

describe('GivenAmountComponent', () => {
  let component: GivenAmountComponent;
  let fixture: ComponentFixture<GivenAmountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GivenAmountComponent]
    });
    fixture = TestBed.createComponent(GivenAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
