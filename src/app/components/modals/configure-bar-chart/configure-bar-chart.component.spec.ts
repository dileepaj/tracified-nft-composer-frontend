import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureBarChartComponent } from './configure-bar-chart.component';

describe('ConfigureBarChartComponent', () => {
  let component: ConfigureBarChartComponent;
  let fixture: ComponentFixture<ConfigureBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigureBarChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
