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

    if (isConnected || isDonatorConnected) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
