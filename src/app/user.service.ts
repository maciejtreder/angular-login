import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { mergeMap, map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private basePath = 'http://localhost:8080';
  private $authToken: Subject<string> = new BehaviorSubject<string>(localStorage.getItem('authToken') as string);
  
  constructor(private http: HttpClient) { }

  public authenticate(credentials: {login: string, password: string}): Observable<boolean> {
    return this.http.post<any>(`${this.basePath}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.authToken);
        this.$authToken.next(response.authToken);
      }),
      map(_ => true),
      catchError(err => of(false))
    );
  }
 
  public getSecretInfo(): Observable<any> {
    return this.$authToken.pipe(
      mergeMap(token => this.http.get(`${this.basePath}/secret`, {headers: new HttpHeaders({auth: token})}))
    )
  }

  public getUser(): Observable<any> {
    return this.$authToken.pipe(
      map(token => {
        if (!!token) {
          const parts = token.split(".");
          return JSON.parse(atob(parts[1])); 
        } else {
          return {name: "unauthorized user", unauthorized: true};
        }
      })
    )
  }
 
}
