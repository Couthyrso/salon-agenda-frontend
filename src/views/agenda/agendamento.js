import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './agendamento.css';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

const Agendamento = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { servicePrice, serviceName } = location.state || {};

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    // Redireciona se não houver dados do serviço
    useEffect(() => {
        if (!servicePrice || !serviceName) {
            navigate('/home');
        }
    }, [servicePrice, serviceName, navigate]);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Seleção de horário, 2: Pagamento
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentError, setPaymentError] = useState('');

    // Função para calcular o valor final do pagamento
    const calculateFinalPrice = () => {
        const price = Number(servicePrice) || 0;
        let finalPrice = price;

        // Aplica taxas ou descontos baseado no método de pagamento
        switch (paymentMethod) {
            case 'credit':
                // Taxa de 5% para cartão de crédito
                finalPrice = price;
                break;
            case 'debit':
                // Sem taxa para débito
                finalPrice = price;
                break;
            case 'pix':
                // 5% de desconto para PIX
                finalPrice = price;
                break;
            default:
                finalPrice = price;
        }

        return finalPrice;
    };

    // Horários disponíveis (exemplo)
    const allTimes = [
        '09:00', '10:00', '11:00', '12:00', '13:00', 
        '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    // Função para obter o horário atual de Brasília
    const getBrasiliaTime = () => {
        const now = new Date();
        // Ajusta para o fuso horário de Brasília (UTC-3)
        return new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    };

    // Função para verificar se é hoje
    const isToday = (dateString) => {
        const today = new Date();
        const selectedDate = new Date(dateString);
        return selectedDate.toDateString() === today.toDateString();
    };

    // Função para verificar se o horário já passou
    const isTimePassed = (dateString, timeString) => {
        const now = new Date();
        const [hours, minutes] = timeString.split(':').map(Number);
        const selectedDateTime = new Date(dateString);
        selectedDateTime.setHours(hours, minutes, 0, 0);
        return selectedDateTime < now;
    };

    // Função para atualizar horários disponíveis quando a data é selecionada
    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setSelectedTime('');
        setError('');

        if (date) {
            if (isToday(date)) {
                // Se for hoje, filtra os horários que já passaram
                const available = allTimes.filter(time => !isTimePassed(date, time));
                setAvailableTimes(available);
            } else {
                // Se não for hoje, todos os horários estão disponíveis
                setAvailableTimes(allTimes);
            }
        }
    };

    // Função para lidar com a seleção de horário
    const handleTimeSelect = (time) => {
        if (selectedDate && isToday(selectedDate) && isTimePassed(selectedDate, time)) {
            setError('Este horário já passou');
            return;
        }
        setSelectedTime(time);
        setError('');
    };

    // Função para ir para a tela de pagamento
    const goToPayment = () => {
        if (!selectedDate || !selectedTime) {
            setError('Por favor, selecione uma data e horário');
            return;
        }
        setStep(2);
    };

    // Função para voltar para a seleção de horário
    const goBack = () => {
        setStep(1);
        setPaymentMethod('');
        setPaymentError('');
    };

    // Função para salvar o agendamento
    const salvarAgendamento = () => {
        const novoAgendamento = {
            id: Date.now(), // Usa o timestamp como ID único
            servico: serviceName || 'Serviço',
            data: selectedDate,
            horario: selectedTime,
            preco: servicePrice || 0,
            metodoPagamento: paymentMethod === 'credit' ? 'Cartão de Crédito' : 
                           paymentMethod === 'debit' ? 'Cartão de Débito' : 
                           paymentMethod === 'pix' ? 'PIX' : 'Não definido'
        };

        // Recupera agendamentos existentes
        const agendamentosExistentes = JSON.parse(localStorage.getItem('agendamentos') || '[]');
        
        // Adiciona o novo agendamento
        const agendamentosAtualizados = [...agendamentosExistentes, novoAgendamento];
        
        // Salva no localStorage
        localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));
    };

    // Função para processar o pagamento
    const handlePayment = async () => {
        if (!paymentMethod) {
            setPaymentError('Por favor, selecione um método de pagamento');
            return;
        }
        
        try {

            // Monta data e hora no formato "YYYY-MM-DD HH:MM:SS"
            const appointmentDateTime = `${selectedDate} ${selectedTime}:00`;

            const appointmentData = {
                service_id: location.state.serviceId,
                appointment_date: appointmentDateTime,
                payment_method: paymentMethod,
                status: 'pending',
                user_id: Cookies.get('userId')
            };


            console.log('Dados do agendamento:', appointmentData);

            const response = await api.post('/api/appointments/store', appointmentData);

            if (response.data) {
                // Salva no localStorage
                const novoAgendamento = {
                    id: Date.now(),
                    servico: serviceName,
                    data: selectedDate,
                    horario: selectedTime,
                    preco: Number(servicePrice),
                    metodoPagamento: paymentMethod === 'credit' ? 'Cartão de Crédito' : 
                                   paymentMethod === 'debit' ? 'Cartão de Débito' : 
                                   paymentMethod === 'pix' ? 'PIX' : 'Não definido',
                    status: 'Agendado'
                };

                const agendamentosExistentes = JSON.parse(localStorage.getItem('agendamentos') || '[]');
                const agendamentosAtualizados = [...agendamentosExistentes, novoAgendamento];
                localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));

                toast.success('Agendamento realizado com sucesso!', {autoClose: 3000});
                navigate('/meus-agendamentos');
            }
        } catch (error) {
            console.error('Erro ao criar agendamento:', error.response?.data);
            if (error.response?.data?.errors) {
                // Se houver erros de validação específicos
                const errorMessages = Object.values(error.response.data.errors).flat();
                setPaymentError(errorMessages.join('\n'));
            } else {
                setPaymentError(error.response?.data?.message || 'Erro ao processar o agendamento');
            }
        }
    };

    return (
        <div className="agendamento-container">
            <h1>Agende seu Horário</h1>
            
            {step === 1 ? (
                <div className="agendamento-form">
                    <div className="form-group">
                        <label>Selecione a Data:</label>
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={handleDateChange}
                            min={getBrasiliaTime().toISOString().split('T')[0]} // Impede seleção de datas passadas
                        />
                    </div>

                    {selectedDate && (
                        <div className="form-group">
                            <label>Selecione o Horário:</label>
                            <div className="time-grid">
                                {availableTimes.map((time) => (
                                    <button
                                        key={time}
                                        className={`time-button ${selectedTime === time ? 'selected' : ''}`}
                                        onClick={() => handleTimeSelect(time)}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    {selectedDate && selectedTime && !error && (
                        <div className="selected-info">
                            <h3>Horário Selecionado:</h3>
                            <p>Data: {formatDate(selectedDate)}</p>
                            <p>Horário: {selectedTime}</p>
                            <p>Preço: R$ {Number(servicePrice).toFixed(2)}</p>
                            <button className="confirm-button" onClick={goToPayment}>
                                Ir para Pagamento
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="payment-form">
                    <h2>Pagamento</h2>
                    <div className="selected-info">
                        <h3>Resumo do Agendamento:</h3>
                        <p>Serviço: {serviceName}</p>
                        <p>Data: {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
                        <p>Horário: {selectedTime}</p>
                        <p>Preço Base: R$ {Number(servicePrice).toFixed(2)}</p>
                        {paymentMethod && (
                            <p className="price">
                                Valor Final: R$ {calculateFinalPrice().toFixed(2)}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Método de Pagamento:</label>
                        <select 
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="payment-select"
                        >
                            <option value="">Selecione o método de pagamento</option>
                            <option value="credit">Cartão de Crédito</option>
                            <option value="debit">Cartão de Débito</option>
                            <option value="pix">PIX</option>
                        </select>
                    </div>

                    {paymentError && <div className="error-message">{paymentError}</div>}

                    <div className="payment-buttons">
                        <button className="back-button" onClick={goBack}>
                            Voltar
                        </button>
                        <button className="confirm-button" onClick={handlePayment}>
                            Confirmar Pagamento
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Agendamento;
