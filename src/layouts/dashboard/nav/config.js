// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'envoi',
    path: '/dashboard/envoi',
    icon: icon('ic_user'),
  },
  // {
  //   title: 'ramassage',
  //   path: '/dashboard/ramassage',
  //   icon: icon('ic_cart'),
  // },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Parameters',
    path: '/dashboard/parameter',
    icon: icon('ic_parameter'),
    role: 'parameters',
  },
];

export default navConfig;
