import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftSvgComponent } from './nft-svg.component';

describe('NftSvgComponent', () => {
  let component: NftSvgComponent;
  let fixture: ComponentFixture<NftSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
