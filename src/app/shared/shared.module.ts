import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { ReplaceComma } from './pipes/replace-comma.pipe';
import { HotelRoutingModule } from '../hotel-routing.module';


@NgModule({
  declarations: [
    StarRatingComponent,
    ReplaceComma
  ],
  imports: [
    CommonModule
    // ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StarRatingComponent,
    ReplaceComma,
  ]
})
export class SharedModule { }
