import { UserEntity } from './../Models/user-entity.model';
import { environment } from './../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject: BehaviorSubject<UserEntity>;
  public user: Observable<UserEntity>;
  
  constructor(private router: Router,private http:HttpClient) {
    this.userSubject = new BehaviorSubject<UserEntity>(null);
    this.user = this.userSubject.asObservable();
   }
   public get userValue(): UserEntity {
    return this.userSubject.value;
}
  getUserList()
  {
    return this.http.get<UserEntity[]>(`${environment.baseApiUrl}/Users`);
  }
  authenticate(userName:string,password:string)
  {
    return this.http.post<any>(`${environment.baseApiUrl}/Users/authenticate`, {  Username: userName,Password:password })
    .pipe(map(user => {
        this.userSubject.next(user);
        localStorage.setItem("refreshtoken", user.RefreshToken);
        localStorage.setItem("accesstoken", user.AccessToken);
        this.startRefreshTokenTimer();
        return user;
    }));
  } 

  refreshtoken()
  {
    return this.http.post<any>(`${environment.baseApiUrl}/Users/refreshtoken`, { })
    .pipe(map(user => {
      this.stopRefreshTokenTimer();
      this.userSubject.next(user);
      localStorage.setItem("refreshtoken", user.RefreshToken);
      localStorage.setItem("accesstoken", user.AccessToken);
      this.startRefreshTokenTimer();
      return user;
    }));
  } 

  revoketoken(refreshToken:string)
  {
    this.http.post<any>(`${environment.baseApiUrl}/users/revoketoken`, {Token:refreshToken}).subscribe();
    this.stopRefreshTokenTimer();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
   // return this.http.post<any>(`${environment.baseApiUrl}/Users/revoketoken`, { Token:token});
  } 
  
  private refreshTokenTimeout;

  private startRefreshTokenTimer() {
    debugger
      // parse json object from base64 encoded jwt token
      const jwtToken = JSON.parse(atob(this.userValue.AccessToken.split('.')[1]));

      // set a timeout to refresh the token a minute before it expires
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000);
      this.refreshTokenTimeout = setTimeout(() => this.refreshtoken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
      clearTimeout(this.refreshTokenTimeout);
  }
}
