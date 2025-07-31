// component
import AddIcon from '@mui/icons-material/Add';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Receipt from '@mui/icons-material/Receipt';
import { Inventory2, ListAlt, Payment } from '@mui/icons-material';
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
    title: 'Add Invoice',
    path: '/dashboard/add-invoice',
    icon: <Receipt />,
  },
  {
    title: 'Add Statement of Account',
    path: '/dashboard/add-soa',
    icon: <ReceiptLongIcon />,
  },
  {
    title: 'Add Payment',
    path: '/dashboard/add-payment',
    icon: <Payment />
  },
  {
    title: 'Add Supplier',
    path: '/dashboard/add-supplier',
    icon: <ListAlt />
  },
  {
    title: 'Add Product',
    path: '/dashboard/add-product',
    icon: <Inventory2 />,
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
];

export default navConfig;
