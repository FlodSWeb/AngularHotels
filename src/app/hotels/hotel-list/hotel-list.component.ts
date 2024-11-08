import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, catchError, combineLatest, /*concatMap,*/ EMPTY, /*filter,*/ /*interval,*/ /*forkJoin,*/ /*map,*/ /*mergeAll,*/ mergeMap, Observable, of, /*range,*/ /*shareReplay,*/ Subject, switchMap, /*take,*/ /*tap,*/ /*throwError,*/ /*withLatestFrom*/ } from "rxjs";
import { IHotel } from "../shared/models/hotel";
import { HotelListService } from "../shared/services/hotel-list.service";


@Component({
      selector: 'app-hotel-list',
      templateUrl: './hotel-list.component.html',
      styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
      public title = 'Liste hotels';
      public hotels: IHotel[] = [];
      public hotels$: Observable<IHotel[]> = of([]);

      // public hotels: IHotel[] = [
      //   {
      //       "id": 1,
      //       "hotelName": "Buea sweet life",
      //       "description": "Belle vue au bord de la mer",
      //       "price": 230.5,
      //       "imageUrl": "assets/img/hotel-room.jpg",
      //       "rating": 3.5
      // },
      // {
      //       "id": 2,
      //       "hotelName": "Marakech",
      //       "description": "Profitez de la vue sur les montagnes",
      //       "price": 145.5,
      //       "imageUrl": "assets/img/the-interior.jpg",
      //       "rating": 5
      //   },
      //   {
      //       "id": 3,
      //       "hotelName": "Abudja new look palace",
      //       "description": "Séjour complet avec service de voitures",
      //       "price": 120.12,
      //       "imageUrl": "assets/img/indoors.jpg",
      //       "rating": 4
      //       },
      //   {
      //       "id": 4,
      //       "hotelName": "Cape town city",
      //       "description": "Magnifique cadre pour votre séjour",
      //       "price": 135.12,
      //       "imageUrl": "assets/img/window.jpg",
      //       "rating": 2.5
      //       }
      // ];

      public showBadge: boolean = true;
      private _hotelFilter = '';
      public filteredHotels: IHotel[] = [];
      public filteredHotels$: Observable<IHotel[]> = of([]);
      public filterSubject: Subject<string> = new BehaviorSubject<string>('');
      public receivedRating: string | undefined;
      public errMsg: string | undefined;
      // private a$: Observable<number> | any; pour le shareReplay()

      constructor(
            private hotelListService: HotelListService,
            private http: HttpClient) { }

      ngOnInit() {

            /*
            const a$ = of(1, 2, 3);
            const b$ = of(11, 12, 13);
            const c$ = of(21, 22, 23);
            
            combineLatest([a$, b$, c$]).subscribe((val) => console.log('combineLatest()', val));
            forkJoin([a$, b$, c$]).subscribe((val) => console.log('forkJoin()', val));

            a$.pipe(
                  withLatestFrom(b$, c$)
            ).subscribe((val) => console.log('withLatestFrom() ', val));
            */

            /*TEST MANIP
            const oneTen = ["1", "2", "3", "4", "5", "6"];
            const oneTenNew: number[] = [];
            for (const val of oneTen) {
                  oneTenNew.push(parseInt(val));
                  
                  OU
                  
                  const valInt = parseInt(val);
                  console.log(val);
                  oneTenNew.push(valInt);

            }
            of(oneTenNew).pipe(
                  map((vals: number[]) => vals.map((v: number) => v + 4))
            ).subscribe(v => console.log("one Ten New ", v))*/


            /* SUBJECT ET BEHAVIORSUBJECT
            const subject = new Subject<number>();
            const bSubject = new BehaviorSubject<number>(0);

            subject.subscribe({
                  next: (value) => console.log('A ', value)
            })
            subject.subscribe({
                  next: (value) => console.log('B ', value)
            })

            bSubject.subscribe({
                  next: (value) => console.warn('A ', value)
            })
            bSubject.subscribe({
                  next: (value) => console.warn('B ', value)
            })

            subject.next(1);
            subject.next(2);
            subject.next(3);
            subject.next(4);

            bSubject.next(1);
            bSubject.next(2);
            bSubject.next(3);

            subject.subscribe({
                  next: (value) => console.log('C ', value) // Ca n'affichera pas les précédents subject.next()
            })
            bSubject.subscribe({
                  next: (value) => console.warn('C ', value) // Ca affiche le dernier bSuject avant la création du subscribe()
            })

            subject.next(80000);
            bSubject.next(80000);
            */

            /*
             SHAREREPLAY()
            this.a$ = interval(1000).pipe(
                  take(9),
                  shareReplay(4)
            );

            this.a$.subscribe(console.warn);
            */


            // console.log('Méthode OnInit() démarrée au chargement du component'); 

            const hotelTest$ = of(1, 2, 4).pipe(
                  // map((val) => this.http.get<IHotel>(`api/hotels/${val}`)),
                  // mergeAll()

                  // OU

                  mergeMap(val => this.http.get<IHotel>(`api/hotels/${val}`)),
                  // concatMap(val => this.http.get<IHotel>(`api/hotels/${val}`)) est un peu plus lent que mergeMap()
                  // mais est plus pratique pour suivre un ordre (obs$1 se termine puis obs$2 se lance)
                  //exhaustMap(val => this.http.get<IHotel>(`api/hotels/${val}`)) renvoie le premier élément de l'Observable
                  //switchMap(val => this.http.get<IHotel>(`api/hotels/${val}`)) renvoie le dernier élément de l'Observable
            );

            /*
            OBSERVABLE DE HAUTS RANGS c'est ~= (subscribe(subscribe())), trop couteux. Il faut utiliser mergeAll()
             const hotelTest$ = of(1, 2, 4).pipe(
                  map((val) => this.http.get<IHotel>(`api/hotels/${val}`))
            );
            hotelTest$.subscribe((elem) => {
                  console.log('elem ', elem);// elem représente la liste d'Observable
                  elem.subscribe(value => { // value représente l'élément
                        console.log('value de elem = ', value);
                  })
            });
            */

            // this.hotels$ = this.hotelListService.getHotels().pipe(
            this.hotels$ = this.hotelListService.hotelsWithAdd$.pipe(
                  catchError((err) => {
                        this.errMsg = err
                        // return of([]);
                        // return throwError(err);
                        return EMPTY; // renvoie un Observable<never> donc vide
                  })
            );
            // this.filteredHotels$ = this.hotels$;
            this.filteredHotels$ = this.createFilterHotels(this.filterSubject, this.hotels$);
            this.hotelFilter = '';

            this.hotelListService.getHotels().subscribe({
                  next: hotels => {
                        this.hotels = hotels;
                        this.filteredHotels = this.hotels;
                  },
                  error: err => this.errMsg = err
            });
            this._hotelFilter = '';
      }

      /*
      Pour le SHAREREPLAY()
      public shareReplayTest(): void {
            this.a$.subscribe(console.log)
      }
      */

      public filterChange(value: string): void {
            console.log('value ', value);
            this.filterSubject.next(value);
      }

      public toggleIsNewBadge(): void {
            this.showBadge = !this.showBadge;
      }

      public get hotelFilter(): string {
            return this._hotelFilter;
      }

      public set hotelFilter(filter: string) {
            this._hotelFilter = filter;

            /*
            ANCIENNE LOGIQUE DU createFilterHotel()
            if (this.hotelFilter) {
                  this.filteredHotels$ = this.hotels$.pipe(
                        map((hotels: IHotel[]) => this.filterHotels(filter, hotels))
                  )
            } else {
                  this.filteredHotels$ = this.hotels$;
            }
            */

            // this.filteredHotels = this.hotelFilter ? this.filterHotels(this.hotelFilter) : this.hotels;
      }

      public createFilterHotels(filter$: Observable<string>, hotels$: Observable<IHotel[]>): Observable<IHotel[]> {
            return combineLatest(hotels$, filter$, (hotels: IHotel[], filter: string) => {
                  if (filter == '') return hotels;

                  return hotels.filter(
                        (hotel: IHotel) => hotel.hotelName.toLocaleLowerCase().indexOf(filter) !== -1
                  );
            });
      }

      public receiveRatingClicked(message: string): void {
            this.receivedRating = message;
      }

      private filterHotels(criteria: string, hotels: IHotel[]): IHotel[] {
            criteria = criteria.toLocaleLowerCase();

            const res = this.hotels.filter(
                  (hotel: IHotel) => hotel.hotelName.toLocaleLowerCase().indexOf(criteria) != -1
            );
            return res;
      }
}