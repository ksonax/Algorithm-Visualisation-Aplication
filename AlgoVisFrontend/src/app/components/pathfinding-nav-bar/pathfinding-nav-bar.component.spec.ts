import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathfindingNavBarComponent } from './pathfinding-nav-bar.component';

describe('PathfindingNavBarComponent', () => {
  let component: PathfindingNavBarComponent;
  let fixture: ComponentFixture<PathfindingNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathfindingNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PathfindingNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
