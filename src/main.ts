import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app/app.component';
import {GlobalHttpInterceptor} from "./app/components/notification/global-http.interceptor";
import {routes} from "./app/app-routing.module";

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      RouterModule.forRoot(routes),
      HttpClientModule// replace [] with your routes or import a routing module
    ),
    { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptor, multi: true }
  ]
}).catch(err => console.error(err));
