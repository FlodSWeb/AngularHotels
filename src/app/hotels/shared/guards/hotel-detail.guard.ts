import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelDetailGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      // console.log('route: ', route);
      const id: number = +route.url[1].path;
      
      // const id: number | any = route.url[1].path;
      // console.log('id type ', typeof(id));
      // console.log(id);
      // const id: number | any = route.url[1].path donne le mot 'list' donc pas un number
      // const id: number = +route.url[1].path; ne peut pas convertir 'list' en number
        // donc la condition isNaN(id) est true
      
      if (isNaN(id) || id <= 0) {
        
        // alert('Hotel est inconnu');

        this.router.navigate(['/hotels']);
        return false;
      }

      return true;
  }
  
}
