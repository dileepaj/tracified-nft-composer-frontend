import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftHtmlComponent } from './nft-html.component';

describe('NftHtmlComponent', () => {
  let component: NftHtmlComponent;
  let fixture: ComponentFixture<NftHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftHtmlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
