import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Digram2Component } from './digram2.component';

describe('Digram2Component', () => {
  let component: Digram2Component;
  let fixture: ComponentFixture<Digram2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Digram2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Digram2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
