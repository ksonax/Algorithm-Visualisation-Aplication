export class Queue {

    items:any;

    constructor() {
        this.items = [];
    }
    // adding element to the queue 
    enqueue(element:any) {
 
        this.items.push(element);
    }
    // removing element from the queue 
    //returns underflow when called  
    // on empty queue 
    dequeue() {
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }
    // returns the Front element of  
    // the queue without removing it. 
    front() {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }
    // return true if the queue is empty. 
    isEmpty() {
        return this.items.length == 0;
    }
    printQueue() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i] + " ";
        return str;
    }

}