import { SvgIconProps } from '@mui/material';
import FingerprintIcon from 'components/icons/menu-icons/fingerprint';
import HomeIcon from 'components/icons/menu-icons/HomeIcon';
import LoanIcon from 'components/icons/menu-icons/LoanIcon';
import LogoutIcon from 'components/icons/menu-icons/LogoutIcon';
export enum linkEnum {
  Dashboard = 'dashboard',
  Transactions = 'transactions',
  Fingerprint = 'fingerprint',
  Logout = 'logout',
}
export interface MenuLinkType {
  id: number;
  title: string;
  link: string;
  icon?: (props: SvgIconProps) => JSX.Element;
  available: boolean;
}
export const menuLinks: MenuLinkType[] = [
  {
    id: 1,
    title: linkEnum.Dashboard,
    link: '/transactions',
    icon: HomeIcon,
    available: true,
  },
 
  {
    id: 2,
    title: linkEnum.Fingerprint,
    link: '/fingerprint',
    icon: FingerprintIcon,
    available: true,
  },
  {
    id: 3,
    title: linkEnum.Logout,
    link: '/',
    icon: LogoutIcon,
    available: true,
  },
];
