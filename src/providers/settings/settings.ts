import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
@Injectable()
export class Settings {
  // 'auth-token';

  constructor(public storage: Storage) {}

  setValue(key: string, value: any) {
    return this.storeReady()
        .then(
          (done) => this.storage.set(key, value)
        )
  }
  getValue(key: string) {
    return this.storage.get(key)
      .then(settings => {
        return settings[key];
      });
  }

  storeReady() {
    return this.storage.ready()
  }

  clear() {
    return this.storage.clear()
  }
}
