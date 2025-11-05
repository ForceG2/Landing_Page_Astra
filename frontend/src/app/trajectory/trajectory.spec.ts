import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trajectory } from './trajectory';

describe('Trajectory', () => {
  let component: Trajectory;
  let fixture: ComponentFixture<Trajectory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trajectory],
    }).compileComponents();

    fixture = TestBed.createComponent(Trajectory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
