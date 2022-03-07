import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureChartComponent } from './configure-chart.component';

describe('ConfigureChartComponent', () => {
  let component: ConfigureChartComponent;
  let fixture: ComponentFixture<ConfigureChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
