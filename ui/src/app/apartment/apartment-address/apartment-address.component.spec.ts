import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentAddressComponent } from './apartment-address.component';

describe('ApartmentAddressComponent', () => {
  let component: ApartmentAddressComponent;
  let fixture: ComponentFixture<ApartmentAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartmentAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
