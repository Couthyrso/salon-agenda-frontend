import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './indexadm.css';

const HomeAdm = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newService, setNewService] = useState({
        name: '',
        duration: '',
        price: '',
        description: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('services');
        if (stored) {
            setServices(JSON.parse(stored));
            setLoading(false);
        } else {
            const mockServices = [
                { id: 1, name: 'Corte de cabelo', duration: 30, price: 50, description: 'Corte masculino ou feminino.' },
                { id: 2, name: 'Coloração', duration: 60, price: 120, description: 'Coloração completa para todos os tipos de cabelo.' },
                { id: 3, name: 'Manicure', duration: 45, price: 40, description: 'Manicure com esmaltação.' },
                { id: 4, name: 'Pedicure', duration: 45, price: 45, description: 'Pedicure com esfoliação.' },
                { id: 5, name: 'Maquiagem', duration: 60, price: 80, description: 'Maquiagem profissional para eventos.' }
            ];
            setServices(mockServices);
            localStorage.setItem('services', JSON.stringify(mockServices));
            setLoading(false);
        }
    }, []);

    const handleServiceSelect = (service) => setSelectedService(service);

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

    const handleMeusAgendamentos = () => navigate('/meus-agendamentos');

    const handleAddService = () => {
        const newId = services.length ? Math.max(...services.map(s => s.id)) + 1 : 1;
        const updatedServices = [
            ...services,
            {
                id: newId,
                name: newService.name,
                duration: Number(newService.duration),
                price: Number(newService.price),
                description: newService.description
            }
        ];
        setServices(updatedServices);
        localStorage.setItem('services', JSON.stringify(updatedServices));
        setNewService({ name: '', duration: '', price: '', description: '' });
        setShowForm(false);
    };

    const handleDeleteService = (id) => {
        const updatedServices = services.filter(service => service.id !== id);
        setServices(updatedServices);
        localStorage.setItem('services', JSON.stringify(updatedServices));
    };

    const handleEditService = (id) => {
        const service = services.find(s => s.id === id);
        if (service) {
            setNewService(service);
            handleDeleteService(id);
            setShowForm(true);
        }
    };

    if (loading) return <div className="loading">Carregando serviços...</div>;

    return (
        <div className="homeadm-container">
            <nav className="navbar">
                <div className="logo">Salon Agenda</div>
                <ul className="nav-links">
                    <li><a href="/">Sair</a></li>
                    <li><a href="#services">Serviços</a></li>
                    <li><a href="consultaadm">Consulta</a></li>
                    <li><a href="#contato">Contato</a></li>
                </ul>
            </nav>

            <h1>Serviços Disponíveis</h1>

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setShowForm(false)}>×</button>
                        <h2>Novo Serviço</h2>
                        <input type="text" placeholder="Nome do serviço" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} />
                        <input type="number" placeholder="Duração (minutos)" value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} />
                        <input type="number" placeholder="Preço (R$)" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} />
                        <input type="text" placeholder="Descrição" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
                        <button className='add-button' onClick={handleAddService}>Adicionar Serviço</button>
                    </div>
                </div>
            )}

            <div className="services-section" id="services">
                <div className="services-grid">
                    {services.map((service) => (
                        <div key={service.id} className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`} onClick={() => handleServiceSelect(service)}>
                            <h3>{service.name}</h3>
                            <p>Duração: {service.duration} minutos</p>
                            <p>Preço: R$ {service.price}</p>
                            <p>{service.description}</p>
                            <div className="card-actions">
                                <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEditService(service.id); }}>✎</button>
                                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteService(service.id); }}>🗑</button>
                            </div>
                        </div>
                    ))}

                    {/* Botão "+" ao lado dos cards */}
                    <div className="service-card add-card" onClick={() => setShowForm(!showForm)}>
                        <span className="plus">+</span>
                    </div>
                </div>
            </div>

            {selectedService && (
                <div className="selected-service" id="agendamento">
                    <h2>Serviço Selecionado</h2>
                    <p>{selectedService.description}</p>
                    <p>Duração: {selectedService.duration} minutos</p>
                    <p>Preço: R$ {selectedService.price}</p>
                    <button className="next-button" onClick={handleNextStep}>Agendamento</button>
                </div>
            )}
        </div>
    );
};

export default HomeAdm;
