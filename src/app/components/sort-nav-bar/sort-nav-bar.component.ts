import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-sort-nav-bar',
  templateUrl: './sort-nav-bar.component.html',
  styleUrls: ['./sort-nav-bar.component.css']
})
export class SortNavBarComponent implements OnInit {

  constructor(private sharedService:EventsService,
    private changeSizeSerive:EventsService) { }

  ngOnInit(): void {
  }

  MakeSorting(shortType:String)
  {
    this.sharedService.sendClickEvent(shortType);
  }

  ChangeSize(changeSize:any)
  {
    this.changeSizeSerive.sendSizeChangeEvent(changeSize);
  }

}
