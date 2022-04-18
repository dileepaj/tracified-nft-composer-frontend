import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftTimelineComponent } from './nft-timeline.component';

describe('NftTimelineComponent', () => {
  let component: NftTimelineComponent;
  let fixture: ComponentFixture<NftTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
