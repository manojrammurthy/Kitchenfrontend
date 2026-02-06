import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { AuthInterceptor } from './guards/auth.interceptor';

@NgModule({
  declarations: [
    // Your components here
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    MatButtonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, 
      multi: true
    }
  ],
  bootstrap: [
  ]
})
export class AppModule {}
