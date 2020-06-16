import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestHandlerService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  public to(url: string) {
    return new BuildRequest(this.http, `${this.apiUrl}/${url}`);
  }
}

class BuildRequest {
  constructor(private http: HttpClient, private url: string) {}

  get<T>(): Observable<T> {
    return this.http.get<T>(this.url);
  }

  post<T>(body): Observable<T> {
    return this.http.post<T>(this.url, body);
  }
}
