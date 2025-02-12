import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    name: 'Veiculos',
    url: '/veiculos',
    iconComponent: { name: 'cil-car-alt' }
  },
];
