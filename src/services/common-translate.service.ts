import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from '../enums/language.enum';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonTranslateService {
  private _translateService = inject(TranslateService);

  constructor() {
    this._translateService.addLangs(['en', 'vi', 'km']);
  }

  setLang(lang: LanguageEnum) {
    this._translateService.use(lang);
    localStorage.setItem('lang', lang);
  }
}
