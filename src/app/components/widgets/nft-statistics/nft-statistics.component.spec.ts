import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftStatisticsComponent } from './nft-statistics.component';

describe('NftStatisticsComponent', () => {
  let component: NftStatisticsComponent;
  let fixture: ComponentFixture<NftStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
