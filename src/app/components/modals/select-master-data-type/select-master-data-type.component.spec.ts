import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMasterDataTypeComponent } from './select-master-data-type.component';

describe('SelectMasterDataTypeComponent', () => {
  let component: SelectMasterDataTypeComponent;
  let fixture: ComponentFixture<SelectMasterDataTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectMasterDataTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMasterDataTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
