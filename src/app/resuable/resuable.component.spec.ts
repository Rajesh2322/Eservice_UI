import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResuableComponent } from './resuable.component';

describe('ResuableComponent', () => {
  let component: ResuableComponent;
  let fixture: ComponentFixture<ResuableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResuableComponent]
    });
    fixture = TestBed.createComponent(ResuableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
