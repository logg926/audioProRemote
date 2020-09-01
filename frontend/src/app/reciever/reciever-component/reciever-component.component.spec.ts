import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecieverComponent } from './reciever-component.component';

describe('RecieverComponentComponent', () => {
  let component: RecieverComponent;
  let fixture: ComponentFixture<RecieverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecieverComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecieverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
