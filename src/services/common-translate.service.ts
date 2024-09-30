import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from '../enums/language.enum';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonTranslateService {
  private _translateService = inject(TranslateService);

  isUpdated = new Subject()

  setLang(lang: LanguageEnum) {
    this._translateService.use(lang);
    localStorage.setItem("lang", lang);
    this.isUpdated.next(true)
  }

}
