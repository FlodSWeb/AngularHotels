import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError, of, combineLatest, shareReplay, Subject, merge, scan } from 'rxjs';
import { Category } from '../models/category';
import { IHotel } from '../models/hotel';

@Injectable({
  providedIn: 'root',
})
export class HotelListService {
  // private readonly HOTEL_API_URL = 'api/hotels.json';
  private readonly HOTEL_API_URL = 'api/hotels';

  public hotelsWithCategories$ = combineLatest([
    this.getHotels(),
    this.getCategories()
  ]).pipe(
    map(([hotels, categories]) =>
      hotels.map(hotel => ({
        ...hotel,
        price: hotel.price * .85,
        category: categories.find(category => category.id === hotel.categoryId)?.name
      }) as IHotel)
    )
  );

  private hotelInsertedSubject = new Subject<IHotel>();
  public hotelInserted$ = this.hotelInsertedSubject.asObservable();

  public hotelsWithAdd$ = merge(
    this.hotelsWithCategories$,
    this.hotelInserted$
  ).pipe(
    // scan((acc: IHotel[], value: IHotel | any) => {
    scan((acc: IHotel[], value: IHotel | any) => {
      const index = acc.findIndex((hotel) => hotel.id == value.id);

      if (index !== -1) {
        acc[index] = value;
        console.log('acc ', acc);

        return acc;
      }

      return [...acc, value]
    }),
    shareReplay(1)
  )

  constructor(private http: HttpClient) { }

  public addOrUpdateHotel(newHotel: IHotel): void {
    // newHotel = {
    //   ...newHotel,
    //   imageUrl: 'assets/img/hotel-room.jpg',
    //   id: null,
    // }
    // OU
    // newHotel = this.transformHotel(newHotel); mais hotelEdit.createHotel() fait déjà la transformation
    this.hotelInsertedSubject.next(newHotel);
  }

  public getHotels(): Observable<IHotel[]> {
    return this.http.get<IHotel[]>(this.HOTEL_API_URL).pipe(
      // pour multiplier le price par 10
      // map((hotels: IHotel[]) => hotels.map(
      //   hotel => ({
      //     ...hotel,
      //     // price: hotel.price * 10
      //   }) as IHotel)),
      tap((hotels) => console.log('getHotels(): ', hotels)),
      // tap((hotelsWithCategories$) => console.log('getHotelsWithCat(): ', hotelsWithCategories$)),
      catchError(this.handleError)
    );
  }

  public getHotelById(id: number): Observable<IHotel | any> {
    const url = `${this.HOTEL_API_URL}/${id}`;

    if (id == 0) {
      // of de RXJS permet de créer un Observable à partir d'un objet
      return of(this.getDefaultHotel());
    }
    return this.getHotels().pipe(
      catchError(this.handleError),
      map((hotels) => hotels.find((hotel) => hotel.id == id))
      // tap(hotels => console.log("Hotel by id", hotels))
    );
  }

  public createHotel(hotel: IHotel): Observable<IHotel> {
    // hotel = {
    //   ...hotel,
    //   imageUrl: 'assets/img/hotel-room.jpg',
    //   id: null,
    // }
    // OU
    hotel = this.transformHotel(hotel);
    return this.http.post<IHotel>(this.HOTEL_API_URL, hotel).pipe(
      catchError(this.handleError)
    );
  }

  public updateHotel(hotel: IHotel): Observable<IHotel> {
    const url = `${this.HOTEL_API_URL}/${hotel.id}`;
    return this.http.post<IHotel>(url, hotel).pipe(catchError(this.handleError));
  }

  public deleteHotel(id: number): Observable<IHotel> {
    const url = `${this.HOTEL_API_URL}/${id}`;
    return this.http.delete<IHotel>(url).pipe(catchError(this.handleError));
  }

  private transformHotel(hotel: IHotel): IHotel {
    return {
      ...hotel,
      imageUrl: 'assets/img/hotel-room.jpg',
      id: null,
    };
  }

  private getDefaultHotel(): IHotel {
    return {
      // dans le tuto, null est accepté comme valeur au lieu de '' et 0
      id: 0,
      hotelName: '',
      description: '',
      price: 0,
      rating: 0,
      imageUrl: '',
    };
  }

  public getCategories(): Observable<Category[]> {
    return of([
      {
        id: 0,
        name: 'Motel'
      }, {
        id: 1,
        name: 'Auberge'
      }, {
        id: 2,
        name: 'Palace'
      }, {
        id: 3,
        name: 'Parc'
      }, {
        id: 4,
        name: 'Bungalow'
      }
    ])
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      console.error('An error has occured : ', error.error.message);
      errorMessage = `An error has occured: Error Message : ${error.error.message}`
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was : ${error.error}`
      );
      errorMessage = `Backend returned code ${error.status}, ` + `body was : ${error.error}`
    }
    return throwError('Something wrong happened... Please try again later.' +
      '\n' + errorMessage);
  }
}
