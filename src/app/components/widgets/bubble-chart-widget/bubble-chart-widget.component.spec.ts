import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleChartWidgetComponent } from './bubble-chart-widget.component';

describe('BubbleChartWidgetComponent', () => {
  let component: BubbleChartWidgetComponent;
  let fixture: ComponentFixture<BubbleChartWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BubbleChartWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleChartWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
