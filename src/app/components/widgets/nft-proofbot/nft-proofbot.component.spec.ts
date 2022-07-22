import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftProofbotComponent } from './nft-proofbot.component';

describe('NftProofbotComponent', () => {
  let component: NftProofbotComponent;
  let fixture: ComponentFixture<NftProofbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftProofbotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftProofbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
