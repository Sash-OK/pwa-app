import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  constructor() { }
  public open(name, version) {
    console.log(name, version);
  }
}
