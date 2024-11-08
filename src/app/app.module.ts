import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { HotelEditComponent } from './hotels/hotel-edit/hotel-edit.component';
import { RouterModule } from '@angular/router';
import { HotelModule } from './hotels/hotel.module';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    // HotelEditComponent,
  ],
  imports: [
    BrowserModule,
   // FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // AppRoutingModule, plus besoin de ce module si on utilise le RouterModule
    HotelModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
