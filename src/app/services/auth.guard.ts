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
        
    const isConnected = localStorage.getItem('connexion') === 'true';
    const isDonatorConnected = localStorage.getItem('connexionDonateur') === 'true';
    const isAdminConnected = localStorage.getItem('compte') === 'true';

    if (state.url.startsWith('/login') && (!isConnected && !isDonatorConnected)) {
      this.router.navigate(['/login']);
    } else if (state.url.startsWith('/admin') && !isAdminConnected) {
      this.router.navigate(['/admin']);
    }
    return true;
    
  }

}
