import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, filter, switchMap } from 'rxjs';
import { map } from 'rxjs';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Router, UrlTree } from '@angular/router';

export const USER_STORAGE_KEY = 'APP_TOKEN';

export interface UserData {
  token: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<UserData | null | undefined> =
    new BehaviorSubject<UserData | null | undefined>(undefined);

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  loadUser() {
    const token = localStorage.getItem(USER_STORAGE_KEY);

    if (token) {
      const decoded = jwtDecode<JwtPayload>(token)
      const data: UserData = {
        token: token,
        id: decoded.sub!
      }
      this.user.next(data);
    }
    this.user.next(null);
  }

  register(email: string, password: string) {
    return this.http
      .post('https://apidevelopbetterapps.com/users',
        { email, password })
      .pipe(
        switchMap(() => {
          return this.login(email, password);
        })
      )
  }

  login(email: string, password: string) {
    return this.http
      .post('https://api.developbetterapps.com/auth',
        { email, password })
      .pipe(
        map((response: any) => {
          localStorage.setItem(USER_STORAGE_KEY, response.token);
          const decoded = jwtDecode<JwtPayload>(response.token)
          const data: UserData = {
            token: response.token,
            id: decoded.sub!
          }

          this.user.next(data);
          return data;
        })
      );
  }

  logout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.user.next(null);
  }

  getCurrentUser() {
    return this.user.asObservable();
  }

  getCurrentUserId() {
    return this.user.getValue()?.id;
  }

  isLoggedIn(): Observable<boolean | UrlTree> {
    const router = inject(Router);

    return this.getCurrentUser().pipe(
      filter((user) => user !== undefined),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        }
        return router.createUrlTree(['/']);
      })
    )
  }

  shouldLogIn(): Observable<boolean | UrlTree> {
    const router = inject(Router);

    return this.getCurrentUser().pipe(
      filter((user) => user !== undefined),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return router.createUrlTree(['/dashboard']);
        }
        return true;
      })
    )
  }
}
