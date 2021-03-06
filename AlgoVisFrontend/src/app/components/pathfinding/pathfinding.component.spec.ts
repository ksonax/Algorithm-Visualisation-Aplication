import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathfindingComponent } from './pathfinding.component';

describe('PathfiningComponent', () => {
  let component: PathfindingComponent;
  let fixture: ComponentFixture<PathfindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathfindingComponent ],
      imports: [HttpClientModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PathfindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
