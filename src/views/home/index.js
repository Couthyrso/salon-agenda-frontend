import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './index.css';
import bannerImage from './bannersite.jpg';
import api from '../../services/api';

const Home = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/api/services');
                console.log('Serviços recebidos:', response.data); // Log para debug
                
                // Filtra apenas os serviços ativos, considerando diferentes formatos possíveis
                const activeServices = response.data.filter(service => {
                    // Converte para booleano para garantir a comparação correta
                    const isActive = Boolean(service.status);
                    console.log(`Serviço ${service.name} - Status: ${service.status} - isActive: ${isActive}`); // Log para debug
                    return isActive;
                });
                
                console.log('Serviços ativos:', activeServices); // Log para debug
                setServices(activeServices);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar serviços:', error);
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleServiceSelect = (service) => {
        setSelectedService(service);
    };

    const handleNextStep = () => {
        if (selectedService) {
            navigate('/agendamento', {
                state: {
                    servicePrice: selectedService.price,
                    serviceName: selectedService.name,
                    serviceId: selectedService.id
                }
            });
        }
    };

    const handleMeusAgendamentos = () => {
        navigate('/meus-agendamentos');
    };

    if (loading) {
        return <div className="loading">Carregando serviços...</div>;
    }

    return (
        <div className="home-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">Salon Agenda</div>
                <ul className="nav-links">
                    <li><a href="/">Sair</a></li>
                    <li><a href="#services">Serviços</a></li>
                    <li><a href="/meus-agendamentos">Meus Agendamentos</a></li>
                    <li><Link to="/sobre">Sobre Nós</Link></li>
                </ul>
            </nav>

            {/* Banner */}
            <div className="banner">
                <img src={bannerImage} alt="Banner do salão" />
            </div>

            {/* Conteúdo */}
            <h1>Serviços Disponíveis</h1>

            <div className="services-section" id="services">
                {services.length === 0 ? (
                    <p className="no-services">Nenhum serviço disponível no momento.</p>
                ) : (
                    <div className="services-grid">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                                onClick={() => handleServiceSelect(service)}
                            >
                                <h3>{service.name}</h3>
                                <p>{service.description}</p>
                                <p>Duração: {service.duration} minutos</p>
                                <p>Preço: R$ {service.price}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedService && (
                <div className="selected-service">
                    <h2>Serviço Selecionado</h2>
                    <p><strong>Nome:</strong> {selectedService.name}</p>
                    <p><strong>Descrição:</strong> {selectedService.description}</p>
                    <p><strong>Duração:</strong> {selectedService.duration} minutos</p>
                    <p><strong>Preço:</strong> R$ {selectedService.price}</p>
                    <button className="next-button" onClick={handleNextStep}>
                        Agendar Horário
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
