import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from '../enums/language.enum';

@Injectable({ providedIn: 'root' })
export class CommonTranslateService {
  private _translateService = inject(TranslateService);

  setLang(lang: LanguageEnum) {
    this._translateService.use(lang);
  }
}
