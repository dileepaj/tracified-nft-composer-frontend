import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureTableComponent } from './configure-table.component';

describe('ConfigureTableComponent', () => {
  let component: ConfigureTableComponent;
  let fixture: ComponentFixture<ConfigureTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
