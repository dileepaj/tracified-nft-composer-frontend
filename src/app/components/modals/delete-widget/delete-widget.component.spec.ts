import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWidgetComponent } from './delete-widget.component';

describe('DeleteWidgetComponent', () => {
  let component: DeleteWidgetComponent;
  let fixture: ComponentFixture<DeleteWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
