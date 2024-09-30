import { Component, DestroyRef, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { TranslateService, TranslateModule } from '@ngx-translate/core';  // Import ngx-translate service
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  INavData,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
    TranslateModule
  ]
})
export class DefaultLayoutComponent {
  private _translateService = inject(TranslateService)
  private _destroyRef = inject(DestroyRef)
  public navItems: INavData[] = [];
  constructor(private translate: TranslateService) {
    const navItemNames = navItems.map((navItem) => navItem.name ?? '');
    const navItemBadges = navItems.map((navItem) => navItem.badge?.text ?? '');

    this._translateService
      .stream([...navItemNames, ...navItemBadges])
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((res) => {
        this.navItems = navItems.map((navItem) => ({
          ...navItem,
          name: navItem.name && res?.[navItem.name],
          badge: {
            color: navItem.badge?.color ?? '',
            text: navItem.badge?.text
              ? (res?.[navItem.badge?.text] as string)
              : '',
          },
        }));
      });
  }
  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
}
