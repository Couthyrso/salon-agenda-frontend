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
        (async () => {
            try {
                const res = await api.get('/api/services');
                setServices(res.data);
            } catch (err) {
                toast.error('Erro ao carregar serviços.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', description: '', duration: '', price: '' });
        setServiceToEdit(null);
        setShowForm(false);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
                const res = await api.put(`/api/services/${serviceToEdit.id}`, data);
                setServices(prev =>
                    prev.map(s => (s.id === serviceToEdit.id ? res.data : s))
                );
                toast.success('Serviço atualizado com sucesso!');
            } else {
                const res = await api.post('/api/services/store', data);
                setServices(prev => [...prev, res.data]);
                toast.success('Serviço criado com sucesso!');
            }
            resetForm();
        } catch (err) {
            toast.error('Erro ao salvar serviço.');
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
                    <li><a href="/">Sair</a></li>
                    <li><a href="#services">Serviços</a></li>
                    <li><a href="/gerenciador">Consulta</a></li>
                    <li><a href="#contato">Contato</a></li>
                </ul>
            </nav>

            <ToastContainer />
            <h1>Serviços Disponíveis</h1>

            <button className="add-button" onClick={() => {
                resetForm();
                setShowForm(true);
            }}>
               <div class="add-card">
            <i class="fas fa-plus"></i>
                <span>Adicionar Serviço</span>
         </div>

            </button>

            <div className="services-grid">
                {services.map(service => (
                    <div className="service-card" key={service.id}>
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                        <p>Duração: {service.duration} min</p>
                        <p>Preço: R$ {service.price}</p>
                        <div className="service-actions">
                            <button
                                className="edit-button"
                                onClick={() => {
                                    setFormData(service);
                                    setServiceToEdit(service);
                                    setShowForm(true);
                                }}
                            >
                                Editar
                            </button>
                            <button
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

                        <input type="text" placeholder="Nome"
                            value={formData.name}
                            onChange={e => handleInputChange('name', e.target.value)} />

                        <textarea placeholder="Descrição"
                            value={formData.description}
                            onChange={e => handleInputChange('description', e.target.value)} />

                        <input type="number" placeholder="Duração"
                            value={formData.duration}
                            onChange={e => handleInputChange('duration', e.target.value)} />

                        <input type="number" placeholder="Preço"
                            value={formData.price}
                            onChange={e => handleInputChange('price', e.target.value)} />

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
