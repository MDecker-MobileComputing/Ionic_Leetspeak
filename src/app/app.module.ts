import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgxElectronModule } from 'ngx-electron';

/**
 * Für die Interaktion mit Electron wird das Paket `ngx-electron` als
 * Import hinzugefügt; es kann dann in den einzelnen Klasse bei Bedarf
 * über Constructor Injection eine Instanz von `ElectronService` geholt
 * werden.
 */
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, NgxElectronModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
