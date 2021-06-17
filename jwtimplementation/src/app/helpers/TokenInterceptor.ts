import { UserService } from './../Services/user.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private userService: UserService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.userService.userValue;
        const isLoggedIn = user && user.AccessToken;
        const isApiUrl = request.url.startsWith(environment.baseApiUrl);
        
        if(request.url.indexOf('refreshtoken')!=-1)
        {
            request = request.clone({
                setHeaders: { 'refreshToken': localStorage.getItem("refreshtoken") }
            });
        }
        else if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${user.AccessToken}` }
            });
        }

        return next.handle(request);
    }
}