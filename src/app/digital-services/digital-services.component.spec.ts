import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalServicesComponent } from './digital-services.component';

describe('DigitalServicesComponent', () => {
  let component: DigitalServicesComponent;
  let fixture: ComponentFixture<DigitalServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DigitalServicesComponent]
    });
    fixture = TestBed.createComponent(DigitalServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
