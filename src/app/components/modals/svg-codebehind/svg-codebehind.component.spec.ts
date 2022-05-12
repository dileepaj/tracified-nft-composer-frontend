import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgCodebehindComponent } from './svg-codebehind.component';

describe('SvgCodebehindComponent', () => {
  let component: SvgCodebehindComponent;
  let fixture: ComponentFixture<SvgCodebehindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgCodebehindComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgCodebehindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
