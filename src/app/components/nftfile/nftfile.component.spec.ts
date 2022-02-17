import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftfileComponent } from './nftfile.component';

describe('NftfileComponent', () => {
  let component: NftfileComponent;
  let fixture: ComponentFixture<NftfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
