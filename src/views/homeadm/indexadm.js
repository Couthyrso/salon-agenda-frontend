import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './indexadm.css';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';

    const HomeAdm = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newService, setNewService] = useState({
        name: '',
        description: '',
        duration: '',
        price: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/api/services');
                setServices(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar serviços:', error);
                setLoading(false);
            }
        };
        fetchServices();
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

    const handleAddService = async () => {
        // Validação dos campos
        if (!newService.name || !newService.description || !newService.duration || !newService.price) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        try {
            const serviceData = {
                name: newService.name.trim(),
                description: newService.description.trim(),
                duration: Number(newService.duration),
                price: Number(newService.price)
            };

            // Validação dos números
            if (isNaN(serviceData.duration) || serviceData.duration <= 0) {
                alert('A duração deve ser um número positivo');
                return;
            }

            if (isNaN(serviceData.price) || serviceData.price <= 0) {
                alert('O preço deve ser um número positivo');
                return;
            }

            const response = await api.post('/api/services/store', serviceData);

            if (response.data) {
                // Atualiza a lista de serviços com o novo serviço
                setServices(prevServices => [...prevServices, response.data]);
                setNewService({ 
                    name: '', 
                    description: '', 
                    duration: '', 
                    price: ''
                });
                setShowForm(false);
                alert('Serviço criado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao criar serviço:', error);
            if (error.response?.data?.errors) {
                // Se houver erros de validação específicos
                const errorMessages = Object.values(error.response.data.errors).flat();
                alert(errorMessages.join('\n'));
            } else {
                alert(error.response?.data?.message || 'Erro ao criar serviço. Por favor, tente novamente.');
            }
        }
    };

    const handleDeleteService = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
            try {
                await api.delete(`/api/services/${id}`);
                // Remove o serviço da lista local
                setServices(prevServices => prevServices.filter(service => service.id !== id));
                toast.success('Serviço excluído com sucesso!', {autoClose: 3000});
            } catch (error) {
                console.error('Erro ao excluir serviço:', error);
                toast.error(error.response?.data?.message || 'Erro ao excluir serviço', {autoClose: 3000});
            }
        }
    };

    const handleEditService = async (id) => {
        const service = services.find(s => s.id === id);
        if (service) {
            setNewService(service);
            setShowForm(true);
        }
    };

    const handleUpdateService = async () => {
        if (!newService.id) {
            alert('ID do serviço não encontrado');
            return;
        }

        try {
            const serviceData = {
                name: newService.name.trim(),
                description: newService.description.trim(),
                duration: Number(newService.duration),
                price: Number(newService.price)
            };

            const response = await api.put(`/api/services/${newService.id}`, serviceData);

            if (response.data) {
                // Atualiza a lista de serviços
                setServices(prevServices => 
                    prevServices.map(service => 
                        service.id === newService.id ? response.data : service
                    )
                );
                setNewService({ 
                    name: '', 
                    description: '', 
                    duration: '', 
                    price: '', 
                });
                setShowForm(false);
                alert('Serviço atualizado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                alert(errorMessages.join('\n'));
            } else {
                alert(error.response?.data?.message || 'Erro ao atualizar serviço');
            }
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
                    <li><a href="/gerenciador">Consulta</a></li>
                    <li><a href="#contato">Contato</a></li>
                </ul>
            </nav>
            <ToastContainer/>
            <h1>Serviços Disponíveis</h1>

            <div className="services-section" id="services">
                <button className="add-button" onClick={() => setShowForm(true)}>
                    Adicionar Novo Serviço
                </button>

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
                            <div className="service-actions">
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditService(service.id);
                                }}>
                                    Editar
                                </button>
                                <button onClick={() => handleDeleteService(service.id)}>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{newService.id ? 'Editar Serviço' : 'Novo Serviço'}</h2>
                        <div className="form-group">
                            <label>Nome:</label>
                            <input
                                type="text"
                                value={newService.name}
                                onChange={(e) => setNewService({...newService, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Descrição:</label>
                            <textarea
                                value={newService.description}
                                onChange={(e) => setNewService({...newService, description: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Duração (minutos):</label>
                            <input
                                type="number"
                                value={newService.duration}
                                onChange={(e) => setNewService({...newService, duration: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Preço:</label>
                            <input
                                type="number"
                                value={newService.price}
                                onChange={(e) => setNewService({...newService, price: e.target.value})}
                                required
                            />
                        </div>
                        <div className="modal-buttons">
                            <button onClick={newService.id ? handleUpdateService : handleAddService}>
                                {newService.id ? 'Atualizar Serviço' : 'Adicionar Serviço'}
                            </button>
                            <button onClick={() => {
                                setShowForm(false);
                                setNewService({
                                    name: '',
                                    description: '',
                                    duration: '',
                                    price: ''
                                });
                            }}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeAdm;
