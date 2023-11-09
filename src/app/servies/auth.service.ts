import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';
import { map } from 'rxjs';
import { JwtPayload, jwtDecode } from 'jwt-decode';

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
        switchMap((response: any) => {
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
}
