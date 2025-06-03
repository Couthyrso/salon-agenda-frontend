import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './sobrenos.css';
import raphaelImage from '../../images/raphael.jpeg';
import eduardoImage from '../../images/eduardo.png';
import rafaelImage from '../../images/rafael.png';

const SobreNos = () => {
  const navigate = useNavigate();

  const handleServicesClick = () => {
    navigate('/home#services');
  };

  const teamMembers = [
    {
      name: 'Raphael',
      role: 'Programador Full Stack',
      image: raphaelImage,
    },
    {
      name: 'Eduardo',
      role: 'Programador Backend',
      image: eduardoImage,
    },
    {
      name: 'Rafael',
      role: 'Programador Frontend',
      image: rafaelImage,
    }
  ];

  return (
    <div className="sobre-nos-container">
      {/* Navbar */}
      <nav className="navbar" style={{ backgroundColor: '#353337', color: 'white' }}>
        <div className="logo">Salon Agenda</div>
        <ul className="nav-links">
          <li><Link to="/">Sair</Link></li>
          <li><a href="#" onClick={handleServicesClick}>Serviços</a></li>
          <li><Link to="/meus-agendamentos">Meus Agendamentos</Link></li>
          <li><Link to="/sobrenos">Sobre Nós</Link></li>
        </ul>
      </nav>

      {/* Seção Principal */}
      <div className="hero-section">
        <h1>Sobre Nós</h1>
        <p className="subtitle">Conheça nossa história e nossa missão</p>
      </div>

      {/* História */}
      <section className="historia-section">
        <h2>Nossa História</h2>
        <p>
        O Salon Agenda nasceu da observação de uma necessidade comum no dia a dia de salões de beleza: 
        a dificuldade em organizar agendamentos, evitar conflitos de horários e oferecer praticidade 
        tanto para os clientes quanto para os profissionais. Pensando nisso, desenvolvemos uma plataforma 
        simples, eficiente e acessível, que une tecnologia e funcionalidade para transformar a maneira 
        como os salões gerenciam seus serviços.
        </p>
        <p>
        O projeto começou como um Trabalho de Conclusão de Curso (TCC), com o objetivo de criar uma 
        solução real para um problema recorrente no setor da beleza. Ao longo do desenvolvimento, 
        buscamos entender as dores de donos de salão, cabeleireiros e clientes, e construímos o 
        Salon Agenda com base nessas experiências reais. Hoje, ele representa mais do que um sistema: 
        é uma ferramenta pensada para facilitar rotinas, otimizar tempo e melhorar a experiência de 
        todos os envolvidos.
        </p>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="cards-section">
        <div className="card">
          <h3>Missão</h3>
          <p>
          Oferecer uma plataforma digital intuitiva, prática e eficiente que facilite o agendamento 
          de serviços em salões de beleza, conectando clientes e profissionais de forma organizada e 
          acessível, promovendo uma melhor experiência para ambos os lados.
          </p>
        </div>
        <div className="card">
          <h3>Visão</h3>
          <p>
          Ser referência nacional em soluções tecnológicas para agendamento de serviços de beleza, 
          contribuindo para a modernização do setor e fortalecendo o relacionamento entre salões e 
          seus clientes.
          </p>
        </div>
        <div className="card">
          <h3>Valores</h3>
          <p>
          •Inovação: Buscamos constantemente melhorar e inovar nossas soluções para atender às necessidades do mercado da beleza.<br></br>
          •Praticidade: Valorizamos a simplicidade e facilidade de uso para garantir a melhor experiência ao usuário.<br></br>
          •Comprometimento: Estamos comprometidos com a excelência, confiabilidade e funcionalidade do sistema.  
          </p>
        </div>
      </section>

      {/* Equipe */}
      <section className="equipe-section">
        <h2>Nossa Equipe</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-card" key={index}>
              <img src={member.image} alt={member.name} className="team-avatar" />
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SobreNos;



