import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IHotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.css']
})
export class HotelDetailComponent implements OnInit /*OnDestroy*/ {

  public hotel: IHotel = <IHotel>{};
  public hotel$: Observable<IHotel | any> = of(<IHotel>{});
  // public test = Promise.resolve('variable test de Promesse asynchrone'); //à utiliser dans le template avec le |async
  // public test = of('variable test d\'Observable');
  // public subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelListService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const id: number | any = this.route.snapshot.paramMap.get('id');

    this.hotel$ = this.hotelService.getHotels()
      .pipe(
        map((hotels: IHotel[] | any) => hotels.find((hotel: { id: any; }) => hotel.id == id)),
        tap((hotel: IHotel) => console.log(hotel))
      );

    // .subscribe((hotel: IHotel) => {
    //   this.hotel = hotel;
    //   // console.log('hotel: ', this.hotel);
    // }));

    // console.log(id);
  }

  // ngOnDestroy(): void {
  //   this.subscriptions.unsubscribe();
  // }

  public backToList(): void {
    this.router.navigate(['/hotels']);
  }


}


