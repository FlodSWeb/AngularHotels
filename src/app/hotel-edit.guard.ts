import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HotelEditComponent } from './hotels/hotel-edit/hotel-edit.component';

@Injectable({
  providedIn: 'root'
})
export class HotelEditGuard implements CanDeactivate<HotelEditComponent> {
  canDeactivate(component: HotelEditComponent): boolean {
    if (component.hotelForm.dirty) {
      const hotelName = component.hotelForm.get('hotelName').value || 'Nouvel hôtel';
      return confirm(`Annuler les changements effectués sur ${hotelName} ?`);
    }
    return true;
  }
  
}
