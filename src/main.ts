import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { initSW } from './sw-reg';

if (environment.production) {
  enableProdMode();
}

// initSW();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
