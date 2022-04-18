import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetContentComponent } from './widget-content.component';

describe('WidgetContentComponent', () => {
  let component: WidgetContentComponent;
  let fixture: ComponentFixture<WidgetContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
