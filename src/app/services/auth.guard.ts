import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        
    const isConnected = sessionStorage.getItem('connexion') === 'true';
    const isDonatorConnected = sessionStorage.getItem('connexionDonateur') === 'true';
    const isAdminConnected = sessionStorage.getItem('compte') === 'true';

    if (state.url.startsWith('/login') && (!isConnected && !isDonatorConnected)) {
      this.router.navigate(['/login']);
      return false;
    } else if (state.url.startsWith('/admin') && !isAdminConnected) {
      this.router.navigate(['/admin']);
      return false;
    } else {
      return true;
    }
  }

}
