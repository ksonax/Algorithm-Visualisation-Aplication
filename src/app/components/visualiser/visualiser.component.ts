import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { Subscription} from 'rxjs';
// @ts-ignore
import { getMergeSortAnimations } from 'src/app/algorithms/mergeSort.js';
// @ts-ignore
import { getAnimationsForQuickSort } from 'src/app/algorithms/quickSort.js';
// @ts-ignore
import { getAnimationsForBubbleSort } from 'src/app/algorithms/bubbleSort.js';
// @ts-ignore
import { getAnimationsForHeapSort } from 'src/app/algorithms/heapSort.js';


@Component({
  selector: 'app-visualiser',
  templateUrl: './visualiser.component.html',
  styleUrls: ['./visualiser.component.css']
})
export class VisualiserComponent implements OnInit {

  BARS_AMOUNT = 50;
  PRIMARY_COLOR = '	#909090';
  SECONDARY_COLOR = '#FF0000';
  ANIMATION_SPEED = 10;
  PIVOT_COLOR = "yellow";
  NUMBER_OF_SWAPS = 0;
  Array: number[] = [];
  CURRENT_ALGORITHM = "";
  MIN_ARRAY_VALUE = 10;
  MAX_ARRAY_VALUE = 500;

  clickEventSubscription!:Subscription;
  
  constructor(private eventService:EventsService) { 
    this.resetArray();
    this.clickEventSubscription = this.eventService.getClickEvent().subscribe((shortType)=>{
      this.NUMBER_OF_SWAPS = 0;
      switch(shortType){
        case "re-define":{
          this.resetArray();
          break;
        }
        case "merge":{
          this.CURRENT_ALGORITHM = "MERGE SORT";
          this.mergSort();
          break;
        }
        case "quick":{
          this.CURRENT_ALGORITHM = "QUICK SORT";
          this.quickSort();
          break;
        }
        case "bubble":{
          this.CURRENT_ALGORITHM = "BUBBLE SORT";
          this.bubbleSort();
          break;
        }
        case "heap":{
          this.CURRENT_ALGORITHM = "HEAP SORT";
          this.heapSort();
          break;
        }
      }
    })

    this.eventService.getChangeInSize().subscribe((size)=>{
        this.BARS_AMOUNT = size;
        this.resetArray();
    });
  }

  resetArray(){
    const array = [];

    for (let i = 0; i < this.BARS_AMOUNT; i++) {
      array.push(this.randomIntFromInterval(this.MIN_ARRAY_VALUE, this.MAX_ARRAY_VALUE));
    }
    this.Array = array;
   }

   mergSort(){
    const arrayBars = document.getElementsByClassName('array-bar');
    let animations = getMergeSortAnimations(this.Array);
    for (let i = 0; i < animations.length; i++) {
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = <HTMLElement>arrayBars[barOneIdx];
        const barTwoStyle = <HTMLElement>arrayBars[barTwoIdx];
        const color = i % 3 === 0 ? this.SECONDARY_COLOR : this.PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.style.backgroundColor = color;
          barTwoStyle.style.backgroundColor = color;
        }, i * this.ANIMATION_SPEED);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = <HTMLElement>arrayBars[barOneIdx];
          barOneStyle.style.height = `${newHeight}px`;
          this.NUMBER_OF_SWAPS++;
        }, i * this.ANIMATION_SPEED);
      }
    }
   }

   quickSort(){
    console.log(this.Array);
    let arrayBars = document.getElementsByClassName('array-bar');
    let animations = getAnimationsForQuickSort(this.Array);

    for(let i = 0; i< animations.length; i++)
    {
      let check = animations[i][0];
      if(check === "pivoton")
      {
        let pivotBar = animations[i][1];
        const barPivotStyle = <HTMLElement>arrayBars[pivotBar];
        setTimeout(() => {
         barPivotStyle.style.backgroundColor = this.PIVOT_COLOR;
        }, i * this.ANIMATION_SPEED);
      }
      else if(check === "highLighton")
      {
        const [barOneIdx,barTwoIdx] = animations[i].slice(1);
        const barOneStyle = <HTMLElement>arrayBars[barOneIdx];
        const barTwoeStyle = <HTMLElement>arrayBars[barTwoIdx];

        setTimeout(() => {
          barOneStyle.style.backgroundColor = this.SECONDARY_COLOR;
          barTwoeStyle.style.backgroundColor = this.SECONDARY_COLOR;
         }, i * this.ANIMATION_SPEED);
      }
      else if(check === "highLightoff")
      {
        const [barOneIdx,barTwoIdx] = animations[i].slice(1);
        const barOneStyle = <HTMLElement>arrayBars[barOneIdx];
        const barTwoeStyle = <HTMLElement>arrayBars[barTwoIdx];

        setTimeout(() => {
          barOneStyle.style.backgroundColor = this.PRIMARY_COLOR;
          barTwoeStyle.style.backgroundColor = this.PRIMARY_COLOR;
         }, i * this.ANIMATION_SPEED);
      }
      else if(check === "pivotOff")
      {
        let pivotBar = animations[i][1];
        const barPivotStyle = <HTMLElement>arrayBars[pivotBar];
        setTimeout(() => {
         barPivotStyle.style.backgroundColor = this.PRIMARY_COLOR;
        }, i * this.ANIMATION_SPEED);
      }
      else if(check === "swap")
      {
        const [barIndexOne,barValueOne,barIndexTwo,barValueTwo] = animations[i].slice(1);
        const barOneStyle = <HTMLElement>arrayBars[barIndexOne];
        const barTwoeStyle = <HTMLElement>arrayBars[barIndexTwo];

        setTimeout(() => {
          barOneStyle.style.height = `${barValueOne}px`;
          barTwoeStyle.style.height = `${barValueTwo}px`;
          this.NUMBER_OF_SWAPS++;
         }, i * this.ANIMATION_SPEED);

      }
    }

   }

   bubbleSort()
   {
      let animations = getAnimationsForBubbleSort(this.Array);
      let arrayBars = document.getElementsByClassName('array-bar');

      for(let i = 0; i< animations.length; i++)
      {
        const [check,v1,v2,v3,v4] = animations[i].slice();
        if(check === "HighLightOn")
        {
          let barOneStyle = <HTMLElement>arrayBars[v1];
          let barTwoStyle = <HTMLElement>arrayBars[v2];

          setTimeout(() => {
            barOneStyle.style.backgroundColor = this.SECONDARY_COLOR;
            barTwoStyle.style.backgroundColor = this.SECONDARY_COLOR;
           }, i * this.ANIMATION_SPEED);
        }
        else if(check === "HighLightOff")
        {
          let barOneStyle = <HTMLElement>arrayBars[v1];
          let barTwoStyle = <HTMLElement>arrayBars[v2];

          setTimeout(() => {
            barOneStyle.style.backgroundColor = this.PRIMARY_COLOR;
            barTwoStyle.style.backgroundColor = this.PRIMARY_COLOR;
           }, i * this.ANIMATION_SPEED);
        }
        else if(check === "Swap")
        {
          let barOneStyle = <HTMLElement>arrayBars[v1];
          let barTwoStyle = <HTMLElement>arrayBars[v3];

          setTimeout(() => {
            barOneStyle.style.height = `${v2}px`;
            barTwoStyle.style.height = `${v4}px`;
            this.NUMBER_OF_SWAPS++;
           }, i * this.ANIMATION_SPEED);
        }
      }
   }

   heapSort()
   {
    let animations = getAnimationsForHeapSort(this.Array);
    let arrayBars = document.getElementsByClassName('array-bar');

    for(let i = 0; i< animations.length; i++)
    {
      const [check,v1,v2,v3,v4] = animations[i].slice();
      if(check === "HighLightOn")
      {
        let barOneStyle = <HTMLElement>arrayBars[v1];
        let barTwoStyle = <HTMLElement>arrayBars[v2];

        setTimeout(() => {
          barOneStyle.style.backgroundColor = this.SECONDARY_COLOR;
          barTwoStyle.style.backgroundColor = this.SECONDARY_COLOR;
         }, i * this.ANIMATION_SPEED);
      }
      else if(check === "HighLightOff")
      {
        let barOneStyle = <HTMLElement>arrayBars[v1];
        let barTwoStyle = <HTMLElement>arrayBars[v2];

        setTimeout(() => {
          barOneStyle.style.backgroundColor = this.PRIMARY_COLOR;
          barTwoStyle.style.backgroundColor = this.PRIMARY_COLOR;
         }, i * this.ANIMATION_SPEED);
      }
      else if(check === "Swap")
      {
        let barOneStyle = <HTMLElement>arrayBars[v1];
        let barTwoStyle = <HTMLElement>arrayBars[v3];

        setTimeout(() => {
          barOneStyle.style.height = `${v2}px`;
          barTwoStyle.style.height = `${v4}px`;
          this.NUMBER_OF_SWAPS++;
         }, i * this.ANIMATION_SPEED);
      }
    }
   }

  ngOnInit(): void {
  }
  // From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
  randomIntFromInterval(min:any,max:any) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}
