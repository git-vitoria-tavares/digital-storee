import Logo from '../Logo/Logo';
import facebook from '../../assets/facebook.svg';
import instagram from '../../assets/instagram.svg';
import twitter from '../../assets/twitter.svg';
import './Footer.css';

function Information({ title, informations }) {
  return (
    <div>
      <h3>{title}</h3>
      {informations.map((info) => (
        <a key={info.text} href={info.link}>{info.text}</a>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-about">
          <Logo white />
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          <a href="https://facebook.com"><img src={facebook} alt="Facebook" /></a>
          <a href="https://instagram.com"><img src={instagram} alt="Instagram" /></a>
          <a href="https://twitter.com"><img src={twitter} alt="Twitter" /></a>
        </div>

        <Information
          title="Informação"
          informations={[
            { text: 'Sobre Drip Store', link: '/about' },
            { text: 'Segurança', link: '/security' },
            { text: 'Wishlist', link: '/wishlist' },
            { text: 'Blog', link: '/blog' },
            { text: 'Trabalhe conosco', link: '/careers' },
            { text: 'Meus Pedidos', link: '/pedidos' },
          ]}
        />
        <Information
          title="Categorias"
          informations={[
            { text: 'Camisetas', link: '/products' },
            { text: 'Calças', link: '/products' },
            { text: 'Bonés', link: '/products' },
            { text: 'Headphones', link: '/products' },
            { text: 'Tênis', link: '/products' },
          ]}
        />
        <Information
          title="Contato"
          informations={[
            { text: 'Av. Santos Dumont, 1510 - Fortaleza - CE', link: '#' },
            { text: '(85) 3051-3411', link: '#' },
          ]}
        />
      </div>

      <hr />
      <p className="footer-copy">© {new Date().getFullYear()} Digital Store</p>
    </footer>
  );
}
