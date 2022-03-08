import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurePieChartComponent } from './configure-pie-chart.component';

describe('ConfigurePieChartComponent', () => {
  let component: ConfigurePieChartComponent;
  let fixture: ComponentFixture<ConfigurePieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurePieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurePieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
