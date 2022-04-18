import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftImageComponent } from './nft-image.component';

describe('NftImageComponent', () => {
  let component: NftImageComponent;
  let fixture: ComponentFixture<NftImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
