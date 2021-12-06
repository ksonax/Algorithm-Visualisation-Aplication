import { Component, ViewChild, ElementRef, OnInit, forwardRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
// @ts-ignore
import { seedrandom} from 'seedrandom'
import * as internal from 'stream';

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
  seedrandom = require('seedrandom');

  nodes = new Array(75);; //2d array of square nodes // 75
  canvas!: HTMLCanvasElement;
  ctxGrid!: CanvasRenderingContext2D;

  eraseWall = false;
  changeStartNode = false;
  changeEndNode = false;

  disableButtons = false;

  
  ngOnInit(): void {
    
    //initialize array an grid
    for (let i = 0; i < this.nodes.length; i++) { 
      this.nodes[i] = new Array(31);
    }
    this.canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    this.ctxGrid = <CanvasRenderingContext2D>this.canvas.getContext('2d');

    this.ctxGrid.canvas.height = 775;
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
                console.log("x: "+ i + "y: " +j);
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
        var type = "";

        this.ctxGrid.fillStyle = this.nodeColor;
        this.ctxGrid.strokeRect(x, y, this.nodeSize, this.nodeSize);
        
        this.nodes[i][j] = { x, y, i, j, type};  //x and y are grid coordinates, and i j is the index in array the square object is in
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
            this.ctxGrid.lineWidth = this.lineWidth;
            this.ctxGrid.fillStyle = this.nodeColor;
            this.nodes[i][j].type = "Wall";
            /*
            await new Promise<void>(resolve =>
              setTimeout(() => {
                resolve();
              }, this.animationDelay)
            );*/
            this.ctxGrid.fillRect(this.nodes[i][j].x + 0.5, this.nodes[i][j].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);

          }
          //console.log(this.nodes[i][j].type + "at i:" + i + "at j:" +j);
        }
      }
    }
  }
  
  async genRandomLabirynth(){
    this.resetGrid();
    this.addInnerWalls(true, 1, this.nodes[0].length - 2, 1, this.nodes.length - 2);
    this.addOuterWalls();
  }
  
  async addOuterWalls() {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {
        if (i == 0 || j == 0 || i == this.nodes.length - 1 || j == this.nodes[0].length - 1){
          this.nodes[i][j].type = "Wall";
          this.ctxGrid.fillRect(this.nodes[i][j].x + 0.5, this.nodes[i][j].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);
          /*await new Promise<void>(resolve =>
            setTimeout(() => {
              resolve();
            }, this.animationDelay)
          );*/
        }
      }
    }
  }
  
  async addInnerWalls(h:any, minX:any, maxX:any, minY:any, maxY:any) {
    if (h) {

        if (maxX - minX < 2) {
            return;
        }
        var y = Math.floor(this.randomNumber(minY, maxY, this.seed)/2)*2;
        this.addHWall(minX, maxX, y);

        this.addInnerWalls(!h, minX, maxX, minY, y-1);
        this.addInnerWalls(!h, minX, maxX, y + 1, maxY);
    } else {
        if (maxY - minY < 2) {
            return;
        }

        var x = Math.floor(this.randomNumber(minX, maxX, this.seed)/2)*2;
        this.addVWall(minY, maxY, x);

        this.addInnerWalls(!h, minX, x-1, minY, maxY);
        this.addInnerWalls(!h, x + 1, maxX, minY, maxY);
    }
  }
  
  async addHWall(minX:any, maxX:any, y:any) {
    var hole = Math.floor(this.randomNumber(minX, maxX, this.seed)/2)*2+1;

    for (var i = minX; i <= maxX; i++) {
        if (i == hole) {
          this.nodes[y][i].type = "";
          this.ctxGrid.clearRect(this.nodes[y][i].x + 0.5, this.nodes[y][i].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);
        }
        else {
          this.nodes[y][i].type = "Wall";
          this.ctxGrid.fillRect(this.nodes[y][i].x + 0.5, this.nodes[y][i].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);
        }
    }
  }
  async addVWall(minY:any, maxY:any, x:any) {
    var hole = Math.floor(this.randomNumber(minY, maxY, this.seed)/2)*2+1;

    for (var i = minY; i <= maxY; i++) {
        if (i == hole) {
          this.nodes[i][x].type = "";
          this.ctxGrid.clearRect(this.nodes[i][x].x + 0.5, this.nodes[i][x].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);

        }
        else {
          this.nodes[i][x].type = "Wall";
          this.ctxGrid.fillRect(this.nodes[i][x].x + 0.5, this.nodes[i][x].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);  
        }  
    }
  }
  randomNumber(min:any, max:any, seed:any) {
    var rand = this.seedrandom(this.seed += max + min);
    console.log(Math.floor(rand() * (max - min + 1) + min));
    return Math.floor(rand() * (max - min + 1) + min);
  }
  /*
  async fillMaze(){
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {
        if (this.nodes[i][j].type = "Wall") {
          console.log(this.nodes[i][j].type + "at index [$1][$2]",i,j)
          this.ctxGrid.fillRect(this.nodes[i][j].x + 0.5, this.nodes[i][j].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);
        }
      }
    }
  }

  addPassage(h:any){
    if (h){
      var rand = this.randomNumber(1, this.nodes.length -1);
      this.ctxGrid.clearRect(this.nodes[this.nodes.length -1][rand].x + 0.5, this.nodes[this.nodes.length -1][rand].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);
    }else{
      var rand = this.randomNumber(1, this.nodes[0].length -1);
      this.ctxGrid.clearRect(this.nodes[rand][this.nodes.length -1].x + 0.5, this.nodes[rand][this.nodes.length -1].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);
    }
  }
  */
}
