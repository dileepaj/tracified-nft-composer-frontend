import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlCodebehindComponent } from './html-codebehind.component';

describe('HtmlCodebehindComponent', () => {
  let component: HtmlCodebehindComponent;
  let fixture: ComponentFixture<HtmlCodebehindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HtmlCodebehindComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlCodebehindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
