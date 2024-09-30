import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'MAIN.TITLE', // Key dịch
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'MAIN.NEW' // Key dịch
    }
  },
  {
    name: 'MAIN.LIST', // Key dịch
    url: '/base/tabs',
    badge: {
      color: 'info',
      text: ''
    }
  },
  {
    name: 'MAIN.SEARCH', // Key dịch
    url: '/forms/layout',
    badge: {
      color: 'info',
      text: ''
    }
  },
];
