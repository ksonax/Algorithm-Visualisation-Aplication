import { Component, OnInit } from '@angular/core';
import { AlgorithmsService } from 'src/app/services/algorithms.service';
import { EventsService } from 'src/app/services/events.service';
import { Algorithm } from 'src/app/shared/Algorithm';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {
  currentAlgo: string = "Nie wybrano";
  constructor(public service: AlgorithmsService) { 
    this.service.getChangeSelectedAlgorithm().subscribe((selected)=>{
      this.currentAlgo = selected;
    });
  }

  ngOnInit(): void {
    this.service.getAlgorithmData();

  }
}
