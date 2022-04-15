import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofbotViewComponent } from './proofbot-view.component';

describe('ProofbotViewComponent', () => {
  let component: ProofbotViewComponent;
  let fixture: ComponentFixture<ProofbotViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProofbotViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofbotViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
