import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseProjectComponent } from './close-project.component';

describe('CloseProjectComponent', () => {
  let component: CloseProjectComponent;
  let fixture: ComponentFixture<CloseProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
