import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncRecieveComponent } from './sync-recieve.component';

describe('SyncRecieveComponent', () => {
  let component: SyncRecieveComponent;
  let fixture: ComponentFixture<SyncRecieveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncRecieveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncRecieveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
