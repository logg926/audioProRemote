import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecieverComponentComponent } from './reciever-component.component';

describe('RecieverComponentComponent', () => {
  let component: RecieverComponentComponent;
  let fixture: ComponentFixture<RecieverComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecieverComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecieverComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
