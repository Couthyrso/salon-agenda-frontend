import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './indexadm.css';

const HomeAdm = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const mockServices = [
                    { id: 1, name: 'Corte-de-cabelo', duration: 30, price: 50 },
                    { id: 2, name: 'Coloração', duration: 60, price: 120 },
                    { id: 3, name: 'Manicure', duration: 45, price: 40 },
                    { id: 4, name: 'Pedicure', duration: 45, price: 45 },
                    { id: 5, name: 'Maquiagem', duration: 60, price: 80 }
                ];
                
                setServices(mockServices);
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
                    serviceName: selectedService.name
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
        <div className="homeadm-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">Salon Agenda</div>
                <ul className="nav-links">
                    <li><a href="/">Início</a></li>
                    <li><a href="#services">Serviços</a></li>
                    <li><a href="#" onClick={handleMeusAgendamentos}>Agendamento</a></li>
                    <li><a href="#contato">Contato</a></li>
                </ul>
            </nav>

            <h1>Serviços Disponíveis</h1>
            
            <div className="services-section" id="services">
                <div className="services-grid">
                    {services.map((service) => (
                        <div 
                            key={service.id}
                            className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                            onClick={() => handleServiceSelect(service)}
                        >
                            <h3>{service.name}</h3>
                            <p>Duração: {service.duration} minutos</p>
                            <p>Preço: R$ {service.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            {selectedService && (
                <div className="selected-service" id="agendamento">
                    <h2>Serviço Selecionado</h2>
                    <p>BREVE DESCRIÇÃO DO SERVIÇO</p>
                    <p>Duração: {selectedService.duration} minutos</p>
                    <p>Preço: R$ {selectedService.price}</p>
                    <button className="next-button" onClick={handleNextStep}>
                        Agendamento
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomeAdm;
