import { NgModule } from '@angular/core';
import { IndexedDBService } from './services/indexed-db.service';
import { StoreDriverService } from './services/store-driver.service';

@NgModule({
  declarations: [],
  providers: [
    IndexedDBService,
    StoreDriverService,
  ]
})
export class DataStoreModule {}
