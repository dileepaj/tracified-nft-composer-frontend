import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureBubbleChartComponent } from './configure-bubble-chart.component';

describe('ConfigureBubbleChartComponent', () => {
  let component: ConfigureBubbleChartComponent;
  let fixture: ComponentFixture<ConfigureBubbleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureBubbleChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureBubbleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
