import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HotelDetailComponent } from './hotels/hotel-detail/hotel-detail.component';
import { HotelDetailGuard } from './hotels/shared/guards/hotel-detail.guard';
import { HotelListComponent } from './hotels/hotel-list/hotel-list.component';
import { HotelEditComponent } from './hotels/hotel-edit/hotel-edit.component';
import { HotelEditGuard } from './hotel-edit.guard';



@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'hotels/:id', component: HotelDetailComponent,
        canActivate: [HotelDetailGuard]
      },
      { path: 'hotels', component: HotelListComponent },
      { path: 'hotels/:id/edit', component: HotelEditComponent,
    canDeactivate: [HotelEditGuard] },
    ])
  ],
  exports: [ RouterModule ]
})
export class HotelRoutingModule { }
