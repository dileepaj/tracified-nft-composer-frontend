import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftCarbonfootprintComponent } from './nft-carbonfootprint.component';

describe('NftCarbonfootprintComponent', () => {
  let component: NftCarbonfootprintComponent;
  let fixture: ComponentFixture<NftCarbonfootprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftCarbonfootprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftCarbonfootprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
