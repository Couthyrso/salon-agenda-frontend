import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './agendamento.css';

const Agendamento = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { servicePrice, serviceName } = location.state || {};

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
        let finalPrice = servicePrice || 0;

        // Aplica taxas ou descontos baseado no método de pagamento
        switch (paymentMethod) {
            case 'credit':
                // Taxa de 5% para cartão de crédito
                finalPrice = servicePrice;
                break;
            case 'debit':
                // Sem taxa para débito
                finalPrice = servicePrice;
                break;
            case 'pix':
                // 5% de desconto para PIX
                finalPrice = servicePrice;
                break;
            default:
                finalPrice = servicePrice;
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

    // Função para verificar se um horário já passou
    const isTimePassed = (date, time) => {
        const now = getBrasiliaTime();
        const [hours, minutes] = time.split(':');
        const selectedDateTime = new Date(date);
        selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0);

        return selectedDateTime < now;
    };

    // Função para verificar se é o dia atual
    const isToday = (date) => {
        const today = getBrasiliaTime();
        const selectedDate = new Date(date);
        return selectedDate.toDateString() === today.toDateString();
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
                           paymentMethod === 'pix' ? 'PIX' : 'Não definido',
            status: 'Agendado'
        };

        try {
            // Recupera agendamentos existentes
            const agendamentosExistentes = JSON.parse(localStorage.getItem('agendamentos') || '[]');
            
            // Adiciona o novo agendamento
            const agendamentosAtualizados = [...agendamentosExistentes, novoAgendamento];
            
            // Salva no localStorage
            localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));
            return true;
        } catch (error) {
            console.error('Erro ao salvar agendamento:', error);
            return false;
        }
    };

    // Função para processar o pagamento
    const handlePayment = async () => {
        if (!paymentMethod) {
            setPaymentError('Por favor, selecione um método de pagamento');
            return;
        }
        
        try {
            const response = await api.post('/api/appointments/store', {
                service: serviceName,
                date: selectedDate,
                time: selectedTime,
                price: servicePrice,
                payment_method: paymentMethod,
                status: 'pending'
            });

            if (response.data) {
                const salvou = salvarAgendamento();
                if (salvou) {
                    alert('Agendamento realizado com sucesso!');
                    navigate('/meus-agendamentos', { replace: true });
                } else {
                    setPaymentError('Erro ao salvar o agendamento localmente');
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Token expirado ou inválido
                navigate('/auth/sign-in');
            } else {
                setPaymentError(error.response?.data?.message || 'Erro ao processar o pagamento');
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
                            <p>Data: {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
                            <p>Horário: {selectedTime}</p>
                            <p>Preço: R$ {servicePrice?.toFixed(2)}</p>
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
                        <p>Preço Base: R$ {servicePrice?.toFixed(2)}</p>
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
