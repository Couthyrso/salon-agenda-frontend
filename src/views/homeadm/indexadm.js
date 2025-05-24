import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './indexadm.css';

const HomeAdm = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newService, setNewService] = useState({
        name: '', duration: '', price: '', description: ''
    });
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [editedService, setEditedService] = useState({
        name: '', duration: '', price: '', description: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const storedServices = localStorage.getItem('services');
        if (storedServices) {
            setServices(JSON.parse(storedServices));
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

    useEffect(() => {
        localStorage.setItem('services', JSON.stringify(services));
    }, [services]);

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
        const newId = Date.now();
        const newServiceEntry = {
            id: newId,
            name: newService.name,
            duration: Number(newService.duration),
            price: Number(newService.price),
            description: newService.description
        };
        setServices([...services, newServiceEntry]);
        setNewService({ name: '', duration: '', price: '', description: '' });
        setShowForm(false);
    };

    const handleEditClick = (service) => {
        setEditingServiceId(service.id);
        setEditedService({ ...service });
    };

    const handleSaveEdit = () => {
        setServices(services.map(service =>
            service.id === editingServiceId ? editedService : service
        ));
        setEditingServiceId(null);
    };

    const handleDeleteService = (id) => {
        setServices(services.filter(service => service.id !== id));
    };

    if (loading) return <div className="loading">Carregando serviços...</div>;

    return (
        <div className="homeadm-container">
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

            {showForm && (
                <div className="add-service-form">
                    <button className="close-button" onClick={() => setShowForm(false)}>×</button>
                    <input type="text" placeholder="Nome do serviço" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} />
                    <input type="number" placeholder="Duração (minutos)" value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} />
                    <input type="number" placeholder="Preço (R$)" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} />
                    <input type="text" placeholder="Descrição" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
                    <button onClick={handleAddService}>Adicionar Serviço</button>
                </div>
            )}

            <div className="services-section" id="services">
                <div className="services-grid">
                    {services.map((service) => (
                        <div key={service.id} className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`} onClick={() => handleServiceSelect(service)}>
                            {editingServiceId === service.id ? (
                                <div className="edit-form">
                                    <input type="text" value={editedService.name} onChange={(e) => setEditedService({ ...editedService, name: e.target.value })} />
                                    <input type="number" value={editedService.duration} onChange={(e) => setEditedService({ ...editedService, duration: e.target.value })} />
                                    <input type="number" value={editedService.price} onChange={(e) => setEditedService({ ...editedService, price: e.target.value })} />
                                    <input type="text" value={editedService.description} onChange={(e) => setEditedService({ ...editedService, description: e.target.value })} />
                                    <button onClick={handleSaveEdit}>Salvar</button>
                                </div>
                            ) : (
                                <>
                                    <h3>{service.name}</h3>
                                    <p>Duração: {service.duration} minutos</p>
                                    <p>Preço: R$ {service.price}</p>
                                    <p>{service.description}</p>
                                    <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEditClick(service); }}>Editar</button>
                                    <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteService(service.id); }}>Apagar</button>
                                </>
                            )}
                        </div>
                    ))}
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

            <button className="add-button" onClick={() => setShowForm(!showForm)}>+</button>
        </div>
    );
};

export default HomeAdm;
