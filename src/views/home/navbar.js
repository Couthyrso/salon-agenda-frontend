import React, { useState } from 'react';
import './navbar.css'; // você pode copiar o style.css anterior para esse arquivo

const Navbar = () => {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <nav className="navbar">
      <div className="logo">Beleza+Agendamentos</div>
      <button className="menu-toggle" id="menu-btn" onClick={toggleMenu}>
        &#9776;
      </button>
      <ul className={`nav-links ${menuAberto ? 'show' : ''}`} id="nav-links">
        <li><a href="#inicio">Início</a></li>
        <li><a href="#agendamentos">Agendamentos</a></li>
        <li><a href="#servicos">Serviços</a></li>
        <li><a href="#profissionais">Profissionais</a></li>
        <li><a href="#contato">Contato</a></li>
        <li><a href="#login">Login</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;