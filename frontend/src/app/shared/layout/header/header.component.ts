import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NavigationEnd, Router, Scroll} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserType} from "../../../../types/user.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userInfo: UserType = {id: '', name: '', email: ''};
  activeLink: string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar) {
    this.isLogged = this.authService.getLoggedIn();
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      let currentUrl = '';

      if (event instanceof Scroll) {
        currentUrl = event.routerEvent.url;
      } else if (event instanceof NavigationEnd) {
        currentUrl = event.url;
      }

      if (currentUrl.includes('/#services')) {
        this.changeClass('link1');
      } else if (currentUrl.includes('/#about')) {
        this.changeClass('link2');
      } else if (currentUrl.includes('/blog')) {
        this.changeClass('link3');
      } else if (currentUrl.includes('/#reviews')) {
        this.changeClass('link4');
      } else if (currentUrl.includes('/#contacts')) {
        this.changeClass('link5');
      } else {
        this.activeLink = '';
      }
    });
    this.setUserInfo()

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      if (this.isLogged) {
        this.setUserInfo()
      }
    });
  }

  setUserInfo() {
    this.authService.getUserInfo()
      .subscribe((data: DefaultResponseType | UserType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        let userData = data as UserType;
        if (userData && userData.id && userData.name && userData.email) {
          this.userInfo.name = userData.name
        }
      })
  }

  changeClass(link: string) {
    this.activeLink = link;
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout()
        },
        error: (error: HttpErrorResponse) => {
          this.doLogout()
          if (error.error && error.error.message) {
            console.log(error.error.message)
          }
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    //localStorage.removeItem('commentsWithViolate');
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  toLogin() {
    if (!this.isLogged) {
      this.router.navigate(['/login'])
    }
  }
}
