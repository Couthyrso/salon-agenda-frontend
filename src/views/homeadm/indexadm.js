import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './indexadm.css';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import { Container, Button, Modal } from 'react-bootstrap';
import AnimationWarningLottie from '../../components/AnimationWarningDeleteConfim/AnimationWarningLottie';

const HomeAdm = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [serviceIdToDelete, setServiceIdToDelete] = useState(null);
    const [serviceNameToDelete, setServiceNameToDelete] = useState('');
    const [newService, setNewService] = useState({
        name: '',
        description: '',
        duration: '',
        price: ''
    });

    const handleConfirmDelete = () => {
        if (serviceIdToDelete) {
            handleDeleteService(serviceIdToDelete);
        }
        setShowDeleteModal(false);
    };

    const handleOpenDeleteModal = (serviceId, serviceName) => {
        setServiceIdToDelete(serviceId);
        setServiceNameToDelete(serviceName);
        setShowDeleteModal(true);
    };

    function OpenDeleteModal(props) {
        return (
            <Modal
                show={props.show}
                onHide={props.onHide}
                aria-labelledby='contained-modal-title-vcenter'
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar exclusão de o serviço</Modal.Title>
                </Modal.Header>
                <Modal.Body id='modalBody'>
                    <div className="d-flex justify-content-center">
                        <AnimationWarningLottie />
                    </div>
                    <div className="d-flex justify-content-center">
                        <p>
                            Tem certeza que deseja excluir "{props.serviceName}" ?
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer id='modalFooter'>
                    <Button id='yesButton' onClick={props.onConfirm}>Sim</Button>
                    <Button id='noButton' onClick={props.onHide} >Não</Button>
                </Modal.Footer>
            </Modal>
        );
    }

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

    const handleAddService = async () => {

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
                setServices(prevServices => [...prevServices, response.data]);
                setNewService({
                    name: '',
                    description: '',
                    duration: '',
                    price: ''
                });
                setShowForm(false);
                toast.success('Serviço criado com sucesso!', { autoClose: 3000 });
            }
        } catch (error) {
            console.error('Erro ao criar serviço:', error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                toast.error(errorMessages.join('\n'), { autoClose: 3000 });
            } else {
                toast.error(error.response?.data?.message || 'Erro ao criar serviço. Por favor, tente novamente.', { autoClose: 3000 });
            }
        }
    };

    const handleDeleteService = async (id) => {
        try {
            await api.delete(`/api/services/${id}`);
            setServices(prevServices => prevServices.filter(service => service.id !== id));
            toast.success('Serviço excluído com sucesso!', { autoClose: 3000 });
        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            toast.error(error.response?.data?.message || 'Erro ao excluir serviço', { autoClose: 3000 });
        }
    };

    const handleEditService = async (id, e) => {
        if (e) {
            e.stopPropagation();
        }
        console.log('Editando serviço:', id);
        const service = services.find(s => s.id === id);
        if (service) {
            console.log('Serviço encontrado:', service);
            setNewService(service);
            setShowForm(true);
        }
    };

    const handleAddNewService = (e) => {
        if (e) {
            e.stopPropagation();
        }
        console.log('Abrindo formulário para novo serviço');
        setNewService({
            name: '',
            description: '',
            duration: '',
            price: ''
        });
        setShowForm(true);
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
                toast.success('Serviço atualizado com sucesso!', { autoClose: 3000 });
            }
        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                toast.error(errorMessages.join('\n'), { autoClose: 3000 });
            } else {
                toast.error(error.response?.data?.message || 'Erro ao atualizar serviço', { autoClose: 3000 });
            }
        }
    };

    if (loading) return <div className="loading">Carregando serviços...</div>;

    return (
        <Container fluid className="body homeadm-container">
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
                <ToastContainer />
                <OpenDeleteModal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                    serviceName={serviceNameToDelete}
                />
                <h1>Serviços Disponíveis</h1>

                <div className="services-section" id="services">
                    <button
                        className="add-button"
                        onClick={handleAddNewService}
                    >
                        Adicionar Novo Serviço
                    </button>

                    <div className="services-grid">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                                onClick={() => handleServiceSelect(service)}
                            >
                                <h3 placeholder="service-name">{service.name}</h3>
                                <p>{service.description}</p>
                                <p>Duração: {service.duration} minutos</p>
                                <p>Preço: R$ {service.price}</p>
                                <div className="service-actions">
                                    <button
                                        className="edit-button w-100"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditService(service.id, e);
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="delete-button w-100"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDeleteModal(service.id, service.name);
                                        }}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>{newService.id ? 'Editar Serviço' : 'Novo Serviço'}</h2>
                            <div className="form-group">
                                <label>Nome:</label>
                                <input
                                    type="text"
                                    value={newService.name}
                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                    required
                                    placeholder='Nome do serviço'
                                />
                            </div>
                            <div className="form-group">
                                <label>Descrição:</label>
                                <textarea
                                    value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                    required
                                    placeholder='Descrição do serviço'
                                />
                            </div>
                            <div className="form-group">
                                <label>Duração (minutos):</label>
                                <input
                                    type="number"
                                    value={newService.duration}
                                    onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                                    required
                                    placeholder='Duração do serviço'
                                />
                            </div>
                            <div className="form-group">
                                <label>Preço:</label>
                                <input
                                    type="number"
                                    value={newService.price}
                                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                    required
                                    placeholder='Preço do serviço'
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
        </Container>
    );
};

export default HomeAdm;
