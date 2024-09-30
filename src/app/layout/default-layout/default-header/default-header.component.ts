import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SessionStorageService } from 'src/services/session-storage.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  ProgressBarDirective,
  ProgressComponent,
  SidebarToggleDirective,
  TextColorDirective,
  ThemeDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { CommonTranslateService } from '@services/common-translate.service';
import { LanguageEnum } from '@enums/language.enum';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  standalone: true,
  imports: [
    ContainerComponent,
    HeaderTogglerDirective,
    SidebarToggleDirective,
    IconDirective,
    HeaderNavComponent,
    NavItemComponent,
    NavLinkDirective,
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,
    BreadcrumbRouterComponent,
    ThemeDirective,
    DropdownComponent,
    DropdownToggleDirective,
    TextColorDirective,
    AvatarComponent,
    DropdownMenuDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    BadgeComponent,
    DropdownDividerDirective,
    ProgressBarDirective,
    ProgressComponent,
    TranslateModule,
    NgStyle
  ]
})
export class DefaultHeaderComponent extends HeaderComponent {
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  readonly translateService = inject(TranslateService);
  private _commonTranslateService = inject(CommonTranslateService);
  readonly colorModes = [
    { name: 'light', text: this.translateService.instant('LIGHT_MODE'), icon: 'cilSun' },
    // { name: 'dark', text: 'Tối', icon: 'cilMoon' },
    // { name: 'auto', text: 'Tự động', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });

  constructor(
    private router: Router,
    private sessionService: SessionStorageService,
    private translate: TranslateService
  ) {
    super();
    // Initialize available languages
    this.translate.addLangs(['en', 'vi', 'km']); // Add Khmer (km) to available languages
    this.translate.setDefaultLang('en');
  }

  // Sidebar ID input property
  sidebarId = input('sidebar1');

  // Method to handle language change
  changeLanguage(lang: string) {
    this._commonTranslateService.setLang(lang as LanguageEnum)
  }

  // Logout method
  logout() {
    this.sessionService.removeData('jwt_token');
    this.router.navigateByUrl('/login');
  }
}
