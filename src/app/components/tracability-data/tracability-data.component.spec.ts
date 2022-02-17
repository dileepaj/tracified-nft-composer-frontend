import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracabilityDataComponent } from './tracability-data.component';

describe('TracabilityDataComponent', () => {
  let component: TracabilityDataComponent;
  let fixture: ComponentFixture<TracabilityDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TracabilityDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TracabilityDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
