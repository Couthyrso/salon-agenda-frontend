import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import api from '../../services/api';
import './indexadm.css';
import AnimationWarningLottie from '../../components/AnimationWarningDeleteConfim/AnimationWarningLottie';

const HomeAdm = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState(null);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: '',
        price: '',
    });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const res = await api.get('/api/services');
            console.log('Serviços carregados:', res.data);
            if (res.data && res.data.length > 0) {
                setServices(res.data);
            }
        } catch (err) {
            console.error('Erro ao carregar serviços:', err);
            toast.error('Erro ao carregar serviços.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            duration: '',
            price: '',
        });
        setServiceToEdit(null);
        setShowForm(false);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleEditService = (service) => {
        console.log('Iniciando edição do serviço:', service); // Debug
        setFormData({
            name: service.name || '',
            description: service.description || '',
            duration: service.duration || '',
            price: service.price || ''
        });
        setServiceToEdit(service);
        setShowForm(true);
    };

    const handleAddOrUpdateService = async () => {
        const { name, description, duration, price } = formData;
        if (!name || !description || !duration || !price) {
            toast.warn('Preencha todos os campos.');
            return;
        }

        const data = {
            name: name.trim(),
            description: description.trim(),
            duration: Number(duration),
            price: Number(price),
        };

        try {
            if (serviceToEdit) {
                const serviceId = serviceToEdit.id;
                console.log('Editando serviço:', serviceId, data);

                // Faz a requisição PUT
                await api.post(`/api/services/${serviceId}`, data);
                
                // Atualiza o serviço na lista com os dados enviados
                setServices(prev => 
                    prev.map(s => 
                        s.id === serviceId 
                            ? { ...s, ...data }
                            : s
                    )
                );

                // Força um recarregamento dos serviços após a edição
                setTimeout(async () => {
                    try {
                        const updatedServices = await api.get('/api/services');
                        console.log('Serviços atualizados:', updatedServices.data);
                        if (updatedServices.data && updatedServices.data.length > 0) {
                            setServices(updatedServices.data);
                        }
                    } catch (error) {
                        console.error('Erro ao recarregar serviços:', error);
                    }
                }, 1000);
                
                toast.success('Serviço atualizado com sucesso!');
            } else {
                const res = await api.post('/api/services/store', data);
                setServices(prev => [...prev, res.data]);
                toast.success('Serviço criado com sucesso!');
            }
            resetForm();
        } catch (err) {
            console.error('Erro ao salvar serviço:', err);
            toast.error(err.response?.data?.message || 'Erro ao salvar serviço.');
        }
    };

    const handleDeleteService = async () => {
        if (!serviceToDelete) return;
        try {
            await api.delete(`/api/services/${serviceToDelete.id}`);
            setServices(prev => prev.filter(s => s.id !== serviceToDelete.id));
            toast.success('Serviço excluído com sucesso!');
        } catch (err) {
            toast.error('Erro ao excluir serviço.');
        } finally {
            setShowDeleteModal(false);
            setServiceToDelete(null);
        }
    };

    if (loading) return <div className="loading">Carregando...</div>;

    return (
        <div className="body homeadm-container">
            <nav className="navbar">
                <div className="logo">Salon Agenda</div>
                <ul className="nav-links">
                    <li key="sair"><a href="/">Sair</a></li>
                    <li key="servicos"><a href="#services">Serviços</a></li>
                    <li key="consulta"><a href="/gerenciador">Consulta</a></li>
                </ul>
            </nav>

            <ToastContainer />
            <h1>Serviços Disponíveis</h1>

            <button className="add-button" onClick={() => {
                resetForm();
                setShowForm(true);
            }}>
                <div className="add-card">
                    <i className="fas fa-plus"></i>
                    <span>Adicionar Serviço</span>
                </div>
            </button>

            <div className="services-grid">
                {services && services.map(service => (
                    <div className="service-card" key={`service-${service.id}`}>
                        <div className="service-content">
                            <h3>{service.name || 'Sem nome'}</h3>
                            <p>{service.description || 'Sem descrição'}</p>
                            <p>Duração: {service.duration || 0} min</p>
                            <p>Preço: R$ {service.price || 0}</p>
                        </div>
                        <div className="service-actions">
                            <button
                                key={`edit-${service.id}`}
                                className="edit-button"
                                onClick={() => handleEditService(service)}
                            >
                                Editar
                            </button>
                            <button
                                key={`delete-${service.id}`}
                                className="delete-button"
                                onClick={() => {
                                    setServiceToDelete(service);
                                    setShowDeleteModal(true);
                                }}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{serviceToEdit ? 'Editar Serviço' : 'Novo Serviço'}</h2>

                        <input 
                            type="text" 
                            placeholder="Nome"
                            value={formData.name}
                            onChange={e => handleInputChange('name', e.target.value)} 
                        />

                        <textarea 
                            placeholder="Descrição"
                            value={formData.description}
                            onChange={e => handleInputChange('description', e.target.value)} 
                        />

                        <input 
                            type="number" 
                            placeholder="Duração"
                            value={formData.duration}
                            onChange={e => handleInputChange('duration', e.target.value)} 
                        />

                        <input 
                            type="number" 
                            placeholder="Preço"
                            value={formData.price}
                            onChange={e => handleInputChange('price', e.target.value)} 
                        />

                        <div className="modal-buttons">
                            <button onClick={handleAddOrUpdateService}>
                                {serviceToEdit ? 'Atualizar' : 'Adicionar'}
                            </button>
                            <button onClick={resetForm}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Confirmar Exclusão</h2>
                            <button className="close-button" onClick={() => setShowDeleteModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <AnimationWarningLottie />
                            <p>Deseja excluir o serviço "{serviceToDelete?.name}"?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="confirm-button" onClick={handleDeleteService}>Sim</button>
                            <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>Não</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeAdm;
