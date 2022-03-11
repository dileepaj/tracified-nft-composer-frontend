import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdaleditorComponent } from './ldaleditor.component';

describe('LdaleditorComponent', () => {
  let component: LdaleditorComponent;
  let fixture: ComponentFixture<LdaleditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LdaleditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LdaleditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
