import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsPaneComponent } from './widgets-pane.component';

describe('WidgetsPaneComponent', () => {
  let component: WidgetsPaneComponent;
  let fixture: ComponentFixture<WidgetsPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetsPaneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetsPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
