import { Component, ViewChild, ElementRef, OnInit, forwardRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
// @ts-ignore
import { seedrandom} from 'seedrandom'

@Component({
  selector: 'app-pathfinding',
  templateUrl: './pathfinding.component.html',
  styleUrls: ['./pathfinding.component.css']
})
export class PathfindingComponent implements OnInit {

  constructor() {
  }

  @ViewChild('canvas', { static: true })
  
  //startNodeColor = "#FF3600";
  animationDelay = 0;
  nodeColor = "#909090";
  nodeSize = 25;
  lineWidth = 0.05;
  seed = '';

  nodes = new Array(75);; //2d array of square nodes
  canvas!: HTMLCanvasElement;
  ctxGrid!: CanvasRenderingContext2D;

  eraseWall = false;
  changeStartNode = false;
  changeEndNode = false;

  disableButtons = false;

  
  ngOnInit(): void {
    
    //initialize array an grid
    for (let i = 0; i < this.nodes.length; i++) { 
      this.nodes[i] = new Array(30);
    }
    this.canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    this.ctxGrid = <CanvasRenderingContext2D>this.canvas.getContext('2d');

    this.ctxGrid.canvas.height = 750;
    this.ctxGrid.canvas.width = 1875;
    this.ctxGrid.canvas.style.imageRendering = 'auto';//default
    this.ctxGrid.translate(0.5, 0.5);
    this.ctxGrid.imageSmoothingEnabled = true;

    //generate walls event
    this.canvas.addEventListener('mousemove', (e:MouseEvent) =>{
      const rect = this.canvas.getBoundingClientRect();
      let cx = e.clientX - rect.left;
      let cy = e.clientY - rect.top;
      this.draw_walls(e, cx, cy);
    });
    this.resetGrid();
  }
  getSeedValue(seed:string) {
    this.seed = seed;
  }
  async draw_walls(e:any, cx:any, cy:any) {
    //mouse pressed
    if (e.which == 1) {
      //find out which square object is this
      for (let i = 0; i < this.nodes.length; i++) {

        for (let j = 0; j < this.nodes[i].length; j++) {

          if ((cx < (this.nodes[i][j].x + this.nodeSize) && (cx > this.nodes[i][j].x) && (cy < (this.nodes[i][j].y + this.nodeSize)) && cy > (this.nodes[i][j].y))) {
            //make sure we are not building walls over walls
            if (this.nodes[i][j].type != "Wall") {
              this.ctxGrid.lineWidth = this.lineWidth;
              this.ctxGrid.fillStyle = this.nodeColor;
              this.nodes[i][j].type = "Wall";

              let x = this.nodeSize / 2;
              let y = this.nodeSize / 2;
              let dx = 0;
              let dy = 0;
              //animation
              for (let k = this.nodeSize / 2; k > 0; k--) {
                await new Promise<void>(resolve =>
                  setTimeout(() => {
                    resolve();
                  }, this.animationDelay)
                );
                this.ctxGrid.fillRect(this.nodes[i][j].x + x, this.nodes[i][j].y + y, dx - 0.1, dy - 0.1);
                x--;
                y--;
                dx += 2;
                dy += 2;

              }
            }
          }
        }
      }
    }
  }

  async resetGrid() {

    this.ctxGrid.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctxGrid.lineWidth = this.lineWidth;
    this.ctxGrid.fillStyle = this.nodeColor;
    this.ctxGrid.strokeStyle = this.nodeColor;
        
    //grid with rectangles
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[i].length; j++) {
        //variables
        let x = i * this.nodeSize;
        let y = j * this.nodeSize;

        this.ctxGrid.fillStyle = this.nodeColor;
        this.ctxGrid.strokeRect(x, y, this.nodeSize, this.nodeSize);
        
        this.nodes[i][j] = { x, y, i, j};  //x and y are grid coordinates, and i j is the index in array the square object is in
      }
    }
    
  }

  async RandomLabirynth() {
    this.resetGrid();
    var seedrandom = require('seedrandom');
    var rand = seedrandom();
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {

        if (this.nodes[i][j].type != "Start" && this.nodes[i][j].type != "End") {
          
          rand = seedrandom(this.seed += i + j)

          if (rand() < 0.25) {
            this.nodes[i][j].type == "Wall"
            this.ctxGrid.lineWidth = this.lineWidth;
            this.ctxGrid.fillStyle = this.nodeColor;
            this.nodes[i][j].type = "Wall";
            
            await new Promise<void>(resolve =>
              setTimeout(() => {
                resolve();
              }, this.animationDelay)
            );
            this.ctxGrid.fillRect(this.nodes[i][j].x + 0.5, this.nodes[i][j].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);

          }
        }
      }
    }
  }
}
