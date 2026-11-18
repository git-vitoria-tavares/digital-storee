import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../Logo/Logo';
import cartIcon from '../../assets/mini-cart.svg';
import './Header.css';

export default function Header() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();
    navigate('/products?filter=' + search);
  }

  return (
    <header className="header">
      <div className="header-top">
        <Logo />

        <form className="header-search" onSubmit={handleSearch}>
          <input
            placeholder="Pesquisar produto..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit">&#x2315;</button>
        </form>

        <Link to="/cadastro" className="header-signup">Cadastre-se</Link>
        <Link to="/login" className="header-login">Entrar</Link>

        <img src={cartIcon} alt="Carrinho" />
      </div>

      <nav className="header-menu">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Produtos</NavLink>
        <NavLink to="/categorias">Categorias</NavLink>
        <NavLink to="/pedidos">Meus Pedidos</NavLink>
      </nav>
    </header>
  );
}
