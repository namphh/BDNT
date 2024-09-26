import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Tổng Quan',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'Mới'
    }
  },
  {
    name: 'Hạ Tầng Mạng Lưới',
    url: '/base/tabs',
    // iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: ''
    }
  },
  {
    name: 'Tìm Kiếm',
    url: '/forms/layout',
    // iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: ''
    }
  },
];
