import { Link } from 'react-router-dom';
import logoHeader from '../../assets/logo-header.svg';
import logoFooter from '../../assets/logo-footer.svg';
import './Logo.css';

export default function Logo({ white }) {
  return (
    <Link to="/" className="logo">
      <img src={white ? logoFooter : logoHeader} alt="Digital Store" />
    </Link>
  );
}
