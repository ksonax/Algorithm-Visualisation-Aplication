import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Algorithm } from '../shared/Algorithm';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmsService {

  constructor(private http: HttpClient) { }

  readonly baseUrl = 'https://localhost:44358/algorithm';
  private algorithmSubject = new Subject<any>();

  algorithmData: Algorithm = new Algorithm();
  algorithmsList: Algorithm[];
  selected: string = "";

  getAlgorithmData() {
    this.http.get(this.baseUrl)
      .toPromise()
      .then(res => this.algorithmsList = res as Algorithm[]);
  }

  getSelectedAlgorithm(selected: string){
    return this.algorithmSubject.next(selected);
  }
  getChangeSelectedAlgorithm():Observable<any>{
    return this.algorithmSubject.asObservable();
  }
}
