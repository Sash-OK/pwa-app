import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MyNotificationModule } from './modules/notification/my-notification.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MyNotificationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
