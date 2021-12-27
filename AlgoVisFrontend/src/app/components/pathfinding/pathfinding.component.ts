import { Component, ViewChild, ElementRef, OnInit, forwardRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
// @ts-ignore
import { seedrandom} from 'seedrandom'
import * as internal from 'stream';
import { Console } from 'console';
import { cpuUsage } from 'process';
import { Queue } from 'src/app/queue/queue';
import { AlgorithmsService } from 'src/app/services/algorithms.service';

@Component({
  selector: 'app-pathfinding',
  templateUrl: './pathfinding.component.html',
  styleUrls: ['./pathfinding.component.css']
})
export class PathfindingComponent implements OnInit {
  selected: string = 'A*';
  constructor(private chosenAlgo: AlgorithmsService) {
    
  }

  @ViewChild('canvas', { static: true })
  
  //variables
  seed = '';
  seedSave = '';
  startNodeColor = "green";
  endNodeColor = "red";
  animationDelay = 0;
  nodeColor = "#909090";
  lineWidth = 0.05;
  seedrandom = require('seedrandom');
  startNodePositionX = 1;
  startNodePositionY = 1;
  endNodePositionX = 73;
  endNodePositionY = 29;
  columns = 31;
  rows = 75;
  nodeSize = 25;
  canvasHeight = this.nodeSize*this.columns;
  canvasWidth = this.nodeSize*this.rows;

  nodes = new Array(this.rows);; //2d array of square nodes // 75
  canvas!: HTMLCanvasElement;
  ctxGrid!: CanvasRenderingContext2D;

  eraseWall = false;
  changeStartNode = false;
  changeEndNode = false;

  disableButtons = false;

  
  ngOnInit(): void {
    
    //initialize array an grid
    for (let i = 0; i < this.nodes.length; i++) { 
      this.nodes[i] = new Array(this.columns);
    }
    this.canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    this.ctxGrid = <CanvasRenderingContext2D>this.canvas.getContext('2d');

    this.ctxGrid.canvas.height = this.canvasHeight;
    this.ctxGrid.canvas.width = this.canvasWidth;
    this.ctxGrid.canvas.style.imageRendering = 'auto';//default
    this.ctxGrid.translate(0.5, 0.5);
    this.ctxGrid.imageSmoothingEnabled = true;

    //generate walls event
    this.canvas.addEventListener('mousemove', (e:MouseEvent) =>{
      const rect = this.canvas.getBoundingClientRect();
      let cx = e.clientX - rect.left;
      let cy = e.clientY - rect.top;
      this.drawWalls(e, cx, cy);
    });
    this.resetGrid();
  }

  getSeedValue(seed:string) {
    this.seed = seed;
    this.seedSave = seed;
  }
  //#TODO ADD Method for deleting walls and changing start and end nodes
  async drawWalls(e:any, cx:any, cy:any) {

    if (e.which == 1) {

      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = 0; j < this.nodes[i].length; j++) {

          if ((cx < (this.nodes[i][j].x + this.nodeSize) && (cx > this.nodes[i][j].x) && (cy < (this.nodes[i][j].y + this.nodeSize)) && cy > (this.nodes[i][j].y))) {

            if (this.nodes[i][j].type != "Wall" && this.nodes[i][j].type != "Start" && this.nodes[i][j].type != "End") {
              this.ctxGrid.lineWidth = this.lineWidth;
              this.ctxGrid.fillStyle = this.nodeColor;
              this.nodes[i][j].type = "Wall";

              let x = this.nodeSize / 2;
              let y = this.nodeSize / 2;
              let dx = 0;
              let dy = 0;

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
    this.seed = this.seedSave;
        
    //grid with rectangles
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[i].length; j++) {
        //variables
        let x = i * this.nodeSize;
        let y = j * this.nodeSize;
        var type = "";
        let visited = false;

        //G,H,F for A* algo
        let F = 100000;
        let G = 100000;
        let H = 100000;
        let cameFrom = undefined;
        let neighbors = new Array();

        if (i == this.startNodePositionX && j == this.startNodePositionY) {

          this.ctxGrid.fillStyle = this.startNodeColor;

          type = "Start"
          //draw it
          this.ctxGrid.strokeRect(x, y, this.nodeSize, this.nodeSize);
          this.ctxGrid.fillRect(x, y, this.nodeSize, this.nodeSize);

        } 
        else if (i == this.endNodePositionX && j == this.endNodePositionY) {
            this.ctxGrid.fillStyle = this.endNodeColor;

            type = "End"
            //draw it
            this.ctxGrid.strokeRect(x, y, this.nodeSize, this.nodeSize);
            this.ctxGrid.fillRect(x, y, this.nodeSize, this.nodeSize);
        }
        else {
          this.ctxGrid.fillStyle = this.nodeColor;
          type = "";
          this.ctxGrid.strokeRect(x, y, this.nodeSize, this.nodeSize);
          
        }
        this.nodes[i][j] = { x, y, i, j, type, F, G, H, neighbors, cameFrom, visited };  //x and y are grid coordinates, and i j is the index in array the square object is in

      }
    }
    
  }
  async setStartEndNodes(node: string){
    if (node == "Start"){
      this.ctxGrid.fillStyle = this.startNodeColor;
      this.nodes[this.startNodePositionX][this.startNodePositionY].type = "Start"
      this.ctxGrid.strokeRect(this.nodes[this.startNodePositionX][this.startNodePositionY].x, this.nodes[this.startNodePositionX][this.startNodePositionY].y, this.nodeSize, this.nodeSize);
      this.ctxGrid.fillRect(this.nodes[this.startNodePositionX][this.startNodePositionY].x, this.nodes[this.startNodePositionX][this.startNodePositionY].y, this.nodeSize, this.nodeSize);
    }
    else if (node == "End"){
      this.ctxGrid.fillStyle = this.endNodeColor;
      this.nodes[this.endNodePositionX][this.endNodePositionY].type = "End"
      this.ctxGrid.strokeRect(this.nodes[this.endNodePositionX][this.endNodePositionY].x, this.nodes[this.endNodePositionX][this.endNodePositionY].y, this.nodeSize, this.nodeSize);
      this.ctxGrid.fillRect(this.nodes[this.endNodePositionX][this.endNodePositionY].x, this.nodes[this.endNodePositionX][this.endNodePositionY].y, this.nodeSize, this.nodeSize);
    }
  }
  async clearPath(){
    this.ctxGrid.lineWidth = this.lineWidth;
    this.ctxGrid.strokeStyle = this.nodeColor;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {
        if(this.nodes[i][j].type != 'Wall' && this.nodes[i][j].type != 'Start' && this.nodes[i][j].type != 'End'){
          this.nodes[i][j].type = '';
           this.ctxGrid.clearRect(this.nodes[i][j].x, this.nodes[i][j].y, this.nodeSize, this.nodeSize);
          this.ctxGrid.strokeRect(this.nodes[i][j].x, this.nodes[i][j].y, this.nodeSize, this.nodeSize);
      }
      this.nodes[i][j].visited = false;
      this.nodes[i][j].cameFrom = undefined;
      this.nodes[i][j].F = 0;
      this.nodes[i][j].G = 0;
      this.nodes[i][j].H = 0;
    }
    }
    this.setStartEndNodes("Start");
    this.setStartEndNodes("End");
  }
  async RandomLabirynth() {
    this.resetGrid();
    var rand = this.seedrandom();
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {

        if (this.nodes[i][j].type != "Start" && this.nodes[i][j].type != "End") {
          
          rand = this.seedrandom(this.seed += i + j)

          if (rand() < 0.25) {
            this.ctxGrid.lineWidth = this.lineWidth;
            this.ctxGrid.fillStyle = this.nodeColor;
            this.nodes[i][j].type = "Wall";

            this.ctxGrid.fillRect(this.nodes[i][j].x + 0.5, this.nodes[i][j].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);

          }
        }
      }
    }
  }
  
  async genRandomLabirynth(){
    this.resetGrid();
    this.addInnerWalls(true, 1, this.nodes[0].length - 2, 1, this.nodes.length - 2);
    this.addOuterWallsAndNodes();
    
  }
  
  async addOuterWallsAndNodes() {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {
        if (i == 0 || j == 0 || i == this.nodes.length - 1 || j == this.nodes[0].length - 1){
          this.nodes[i][j].type = "Wall";
          this.ctxGrid.fillRect(this.nodes[i][j].x + 0.5, this.nodes[i][j].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);
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
    return Math.floor(rand() * (max - min + 1) + min);
  }

  findNeighbors() {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {
        if (i < this.nodes.length - 1) {
          this.nodes[i][j].neighbors.push(this.nodes[i + 1][j]);
        }
        if (i > 0) {
          this.nodes[i][j].neighbors.push(this.nodes[i - 1][j]);
        }
        if (j < this.nodes[0].length - 1) {
          this.nodes[i][j].neighbors.push(this.nodes[i][j + 1]);
        }
        if (j > 0) {
          this.nodes[i][j].neighbors.push(this.nodes[i][j - 1]);
        }

      }
    }
  }
  returnNeighbors(node:any) {

    let neighbors = [];
    if (node.i > 0) {
      neighbors.push(this.nodes[node.i - 1][node.j]);
    }
    if (node.i < this.nodes.length - 1) [
      neighbors.push(this.nodes[node.i + 1][node.j])
    ]
    if (node.j > 0) {
      neighbors.push(this.nodes[node.i][node.j - 1]);
    }
    if (node.j < this.nodes[0].length - 1) {
      neighbors.push(this.nodes[node.i][node.j + 1]);
    }

    return neighbors;
  }
  async drawNode(xPos:any, yPos:any, color:any) {
    let x = this.nodeSize / 2;
    let y = this.nodeSize / 2;
    let dx = 0;
    let dy = 0;

    for (let k = this.nodeSize+1; k > 0; k--) {
      await new Promise<void>(resolve =>
        setTimeout(() => {
          resolve();
        }, this.animationDelay + 5)
      );
      this.ctxGrid.fillRect(xPos + x, yPos + y, dx, dy);

      x -= 0.5;
      y -= 0.5;
      dx += 1;
      dy += 1;

    }
  }
  removeFromArray(arr:any, element:any) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == element) {
        arr.splice(i, 1);
      }
    }
  }
  heuristic(a:any, b:any) {
    let d = (Math.abs(a.x - b.x) + Math.abs(a.y - b.y));
    return d;
  }
  //ALGO
  async dijkstraSearch_A_star_variation() {
    this.clearPath();
    this.disableButtons = true;
    let openSet = [];
    let closedSet = [];
    let start, end;
    let path = [];


    this.findNeighbors();

    //nodes is a 2d array of squares
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {
        if (this.nodes[i][j].type == "Start") {
          start = this.nodes[i][j];
        }
        if (this.nodes[i][j].type == "End") {
          end = this.nodes[i][j];
        }
      }
    }

    openSet.push(start);

    while (openSet.length > 0) {

      let lowestIndex = 0;
      //find lowest index
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].F < openSet[lowestIndex].F)
          lowestIndex = i;
      }
      //current node
      let current:any = openSet[lowestIndex];

      //if reached the end
      if (openSet[lowestIndex] === end) {

        path = [];
        let temp = current;
        path.push(temp);
        while (temp.cameFrom) {
          path.push(temp.cameFrom);
          temp = temp.cameFrom;
        }
        console.log("Done!");
        //draw path
        for (let i = path.length - 1; i >= 0; i--) {
          this.ctxGrid.fillStyle = "YELLOW";
          this.ctxGrid.lineWidth = this.lineWidth;
          this.drawNode(path[i].x, path[i].y, "YELLOW")
          await new Promise<void>(resolve =>
            setTimeout(() => {
              resolve();
            }, this.animationDelay)
          );
        }
        this.disableButtons = false;
        break;
      }

      this.removeFromArray(openSet, current);
      closedSet.push(current);

      let my_neighbors = current.neighbors;
      for (let i = 0; i < my_neighbors.length; i++) {
        var neighbor = my_neighbors[i];

        if (!closedSet.includes(neighbor) && neighbor.type != "Wall") {
          let tempG = current.G + 1;

          let newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.G) {
              neighbor.G = tempG;
              newPath = true;
            }
          } else {
            neighbor.G = tempG;
            newPath = true;
            openSet.push(neighbor);
          }

          if (newPath) {
            neighbor.H = this.heuristic(neighbor, end);
            neighbor.G = neighbor.F + neighbor.H;
            neighbor.cameFrom = current;
          }

        }
      }


      //draw
      this.ctxGrid.lineWidth = this.lineWidth;
      for (let i = 0; i < closedSet.length; i++) {
        if (i == 0) {
          this.ctxGrid.fillStyle = this.startNodeColor;
          this.ctxGrid.fillRect(this.nodes[this.startNodePositionX][this.startNodePositionY].x + 0.5, this.nodes[this.startNodePositionX][this.startNodePositionY].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);
        }else {
          this.ctxGrid.fillStyle = "#4287f5";
          this.ctxGrid.fillRect(closedSet[i].x + 0.5, closedSet[i].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);
        }
      }
      for (let i = 0; i < openSet.length; i++) {
        this.ctxGrid.fillStyle = "#00c48d";
        this.ctxGrid.fillRect(openSet[i].x + 0.5, openSet[i].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);

      }
      await new Promise<void>(resolve =>
        setTimeout(() => {
          resolve();
        }, this.animationDelay)
      );
    }
    if (openSet.length <= 0) {
      //no solution
      console.log("NO SOLUTION");
    }

  }
  async a_star_search() {
    this.clearPath();
    this.disableButtons = true;
    let openSet = [];
    let closedSet = [];
    let start, end;
    let path = [];


    this.findNeighbors();


    //shapes is a 2d array of squares... a grid
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {
        if (this.nodes[i][j].type == "Start") {
          start = this.nodes[i][j];
        }
        if (this.nodes[i][j].type == "End") {
          end = this.nodes[i][j];
        }
      }
    }

    openSet.push(start);

    while (openSet.length > 0) {

      let lowestIndex = 0;
      //find lowest index
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].F < openSet[lowestIndex].F)
          lowestIndex = i;
        else if (openSet[i].F === openSet[lowestIndex].F) {
          if (openSet[i].H < openSet[lowestIndex].H) {
            lowestIndex = i;
          }
        }
      }
      //current node
      let current:any = openSet[lowestIndex];

      //if reached the end
      if (openSet[lowestIndex] === end) {

        path = [];
        let temp = current;
        path.push(temp);
        while (temp.cameFrom) {
          path.push(temp.cameFrom);
          temp = temp.cameFrom;
        }
        console.log("Done!"); // DONE
        //draw path
        for (let i = path.length - 1; i >= 0; i--) {
          this.ctxGrid.fillStyle = "#ffff00";
          this.ctxGrid.lineWidth = this.lineWidth;
          this.drawNode(path[i].x, path[i].y, "#ffff00")
          await new Promise<void>(resolve =>
            setTimeout(() => {
              resolve();
            }, this.animationDelay)
          );
        }
        this.disableButtons = false;
        break;
      }

      this.removeFromArray(openSet, current);
      closedSet.push(current);

      let my_neighbors = current.neighbors;
      for (let i = 0; i < my_neighbors.length; i++) {
        var neighbor = my_neighbors[i];

        if (!closedSet.includes(neighbor) && neighbor.type != "Wall") {
          let tempG = current.G + 1;

          let newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.G) {
              neighbor.G = tempG;
              newPath = true;
            }
          } else {
            neighbor.G = tempG;
            newPath = true;
            openSet.push(neighbor);
          }

          if (newPath) {
            neighbor.H = this.heuristic(neighbor, end);
            neighbor.F = neighbor.G + neighbor.H;
            neighbor.cameFrom = current;
          }

        }
      }


      //draw
      this.ctxGrid.lineWidth = this.lineWidth;
      for (let i = 0; i < closedSet.length; i++) { //BLUE
        this.ctxGrid.fillStyle = "#4287f5";
        this.ctxGrid.fillRect(closedSet[i].x + 0.5, closedSet[i].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);
        //this.drawNode(closedSet[i].x, closedSet[i].y, "#4287f5");
      }
      for (let i = 0; i < openSet.length; i++) { //GREEN
        this.ctxGrid.fillStyle = "#00c48d";
        this.ctxGrid.fillRect(openSet[i].x + 0.5, openSet[i].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);
        //this.drawNode(closedSet[i].x, closedSet[i].y, "#00c48d");

      }
      await new Promise<void>(resolve =>
        setTimeout(() => {
          resolve();
        }, this.animationDelay)
      );
    }
    if (openSet.length <= 0) {
      //no solution
      this.disableButtons = false;
    }

  }
  async bfs_Search() {
    this.clearPath();
    this.disableButtons = true;

    let start;
    let end;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {
        if (this.nodes[i][j].type == "Start") {
          start = this.nodes[i][j];
        }
        if (this.nodes[i][j].type == "End") {
          end = this.nodes[i][j];
        }
      }
    }

    console.log(end.i + " " + end.j);

    let queue = new Queue();
    queue.enqueue(start);

    while (!queue.isEmpty()) {
      let node = queue.dequeue();

      if (node == end) {
        let current = end;
        let path = new Array();
        while (current != start) {
          current = current.cameFrom;
          path.push(current);
        }
        for (let i = path.length - 1; i >= 0; i--) {
          this.ctxGrid.fillStyle = "#ffff00";
          this.ctxGrid.lineWidth = this.lineWidth;
          this.drawNode(path[i].x, path[i].y, "#ffff00")
          await new Promise<void>(resolve =>
            setTimeout(() => {
              resolve();
            }, this.animationDelay)
          );
        }
        this.disableButtons = false;
        break;
      }

      let neighbors = this.returnNeighbors(node);

      for (let i = 0; i < neighbors.length; i++) {
        if (!neighbors[i].visited && neighbors[i].type != "Wall") {
          neighbors[i].visited = true;
          neighbors[i].cameFrom = node;
          queue.enqueue(neighbors[i]);
          this.ctxGrid.fillStyle = "#4287f5";
          this.ctxGrid.fillRect(neighbors[i].x + 0.5, neighbors[i].y + 0.5, this.nodeSize - 1, this.nodeSize - 1);
        }
      }
      await new Promise<void>(resolve =>
        setTimeout(() => {
          resolve();
        }, this.animationDelay)
      );
    }
  }
  async visualise(algo: string){
    switch(algo) {
      case 'A*':{
        this.a_star_search();
        break;
      }
      case 'BFS':{
        this.bfs_Search();
        break;
      }
      case 'Dijkstra':{
        this.dijkstraSearch_A_star_variation();
        break;
      }
      default:
        console.log(this.selected);
    }
  }
  chooseAlgo(selected:any){
    this.chosenAlgo.getSelectedAlgorithm(selected);
  }
}
