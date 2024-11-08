import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounce, debounceTime, EMPTY, from, fromEvent, merge, Observable, timer } from 'rxjs';
import { IHotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';
import { GlobalGenericValidator } from '../shared/validators/global-generic.validator';
import { NumberValidator } from '../shared/validators/numbers.validators';

@Component({
  selector: 'app-hotel-edit',
  templateUrl: './hotel-edit.component.html',
  styleUrls: ['./hotel-edit.component.css'],
})
export class HotelEditComponent implements OnInit, AfterViewInit {

  // @ViewChild('test', { static: true }) test: ElementRef | undefined;
  @ViewChildren(FormControlName, { read: ElementRef }) inputElements: ElementRef[] | undefined;

  public hotelForm: FormGroup | any;

  public hotel: IHotel | undefined;

  public pageTitle: string | undefined;

  public errorMessage: string | undefined;

  public formErrors: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } } = {
    hotelName: {
      required: 'Le nom de l\'hôtel est obligatoire',
      minlength: 'Le nom de l\'hotel doit comporter au moins 4 caractères'
    },
    price: {
      required: 'Le prix de l\'hôtel est obligatoire',
      pattern: 'Le prix de l\'hôtel doit être un nombre'
    },
    rating: {
      range: 'Donnez une note entre 1 et 5'
    }
  };

  private globalGenericValidator: GlobalGenericValidator | undefined;

  private isFormSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelListService
  ) { }

  ngOnInit(): void {
    this.globalGenericValidator = new GlobalGenericValidator(this.validationMessages);
    this.hotelForm = this.fb.group({
      hotelName: ['',
        [Validators.required, Validators.minLength(4)]],
      price: ['',
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      rating: ['', NumberValidator.range(1, 5)],
      description: [''],
      tags: this.fb.array([]),
    });

    this.route.paramMap.subscribe((params) => {
      const id: number | any = params.get('id');
      console.log(id);
      this.getSelectedHotel(id);
    });
  }

  ngAfterViewInit() {
    // if (this.test) {
    //   this.test.nativeElement.value = 'test de afterview';
    // }
    if (this.inputElements) {
      const formControlBlurs: Observable<unknown>[] = this.inputElements
        .map((formControlElemRef: ElementRef) => fromEvent(formControlElemRef.nativeElement, 'blur'));

      merge(this.hotelForm.valueChanges, ...formControlBlurs)
        .pipe(
          // debounceTime(800)
          debounce(() => this.isFormSubmitted ? EMPTY : timer(800))
        )
        .subscribe(() => {
          if (this.globalGenericValidator) {
            this.formErrors = this.globalGenericValidator.createErrorMessage(this.hotelForm);
            console.log('errors: ', this.formErrors);
            // console.log('this.formErrors ', this.formErrors['hotelName']);
          }
        })
    }
  }

  public hideError(): void {
    this.errorMessage = undefined;
  }

  public get tags(): FormArray {
    return this.hotelForm.get('tags') as FormArray;
  }

  public addTags(): void {
    this.tags.push(new FormControl())
  }

  public deleteTag(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }

  public getSelectedHotel(id: number): void {
    this.hotelService.getHotelById(id).subscribe((hotel: IHotel) => {
      console.log('getSelectedHotel(): ', this.hotel);
      this.displayHotel(hotel);
    });
  }

  public displayHotel(hotel: IHotel): void {
    this.hotel = hotel;
    console.log('displayHotel(): ', hotel);

    // if(this.hotel.hotelId == 0) {
    //   this.pageTitle = 'Créer un hotel';
    // } else {
    //   this.pageTitle = `Modifier l\'hotel ${hotel.hotelName}`;
    // }
    //  OU
    this.pageTitle =
      this.hotel.id == 0
        ? 'Créer un hotel'
        : `Modifier hotel ${hotel.hotelName}`;

    this.hotelForm.patchValue({
      hotelName: this.hotel.hotelName,
      price: this.hotel.price,
      rating: this.hotel.rating,
      description: this.hotel.description,
    });
    this.hotelForm.setControl('tags', this.fb.array(this.hotel.tags || []));
    //passer la valeur d'un array à un formulaire
  }

  public saveHotel(): void {
    this.isFormSubmitted = true;

    this.hotelForm.updateValueAndValidity({
      onlySelf: true,
      emitEvent: true
    });

    console.log('hotel Name: ', this.hotelForm.value.hotelName);

    if (this.hotelForm.valid) {
      if (this.hotelForm.dirty) {
        const hotel: IHotel = {
          ...this.hotel,
          ...this.hotelForm.value,
        }

        if (hotel.id == 0) {
          this.hotelService.createHotel(hotel).subscribe({
            next: (val: IHotel) => this.saveCompleted(val),
            error: (err) => this.errorMessage = err
          })
        } else {
          this.hotelService.updateHotel(hotel).subscribe({
            next: () => this.saveCompleted(hotel),
            error: (err) => this.errorMessage = err
          })
          console.log('saveHotel(): ', this.hotelForm.value);
        }
      }
    } else {
      this.errorMessage = 'Corrigez les erreurs svp';
      console.log('saveHotel(): error ', this.hotelForm.value);
    }

    console.log('saveHotel(): ', this.hotelForm.value);
  }

  public deleteHotel(): void {
    if (!!this.hotel) {
      if (confirm(`Voulez vous vraiment supprimer ${this.hotel.hotelName} ?`)) {
        this.hotelService.deleteHotel(this.hotel.id).subscribe({
          next: () => this.saveCompleted(),
        });
      }
    }
  }

  public saveCompleted(hotel?: IHotel | any): void {
    this.hotelService.addOrUpdateHotel(hotel);
    this.hotelForm.reset();
    this.router.navigate(['/hotels/list']);
  }
}
