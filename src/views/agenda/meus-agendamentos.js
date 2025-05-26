import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './agendamento.css';

const MeusAgendamentos = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Recupera os agendamentos do localStorage
        const agendamentosSalvos = localStorage.getItem('agendamentos');
        if (agendamentosSalvos) {
            setAgendamentos(JSON.parse(agendamentosSalvos));
        }
    }, []);

    const handleVoltarHome = () => {
        navigate('/home');
    };

    const handleExcluirAgendamento = (id) => {
        // Confirma se o usuário realmente quer excluir
        if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
            // Filtra o agendamento que será excluído
            const agendamentosAtualizados = agendamentos.filter(agendamento => agendamento.id !== id);
            
            // Atualiza o estado
            setAgendamentos(agendamentosAtualizados);
            
            // Atualiza o localStorage
            localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));
            
            alert('Agendamento excluído com sucesso!');
        }
    };

    return (
        <div className="agendamento-container">
            <h1>Meus Agendamentos</h1>
            
            <div className="agendamentos-list">
                {agendamentos.length > 0 ? (
                    agendamentos.map((agendamento) => (
                        <div key={agendamento.id} className="agendamento-card">
                            <h3>Agendamento #{agendamento.id}</h3>
                            <div className="agendamento-info">
                                <p><strong>Serviço:</strong> {agendamento.servico}</p>
                                <p><strong>Data:</strong> {new Date(agendamento.data).toLocaleDateString('pt-BR')}</p>
                                <p><strong>Horário:</strong> {agendamento.horario}</p>
                                <p><strong>Preço:</strong> R$ {agendamento.preco.toFixed(2)}</p>
                                <p><strong>Método de Pagamento:</strong> {agendamento.metodoPagamento}</p>
                            </div>
                            <button 
                                className="delete-button"
                                onClick={() => handleExcluirAgendamento(agendamento.id)}
                            >
                                Excluir Agendamento
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="no-agendamentos">
                        <p>Você ainda não tem agendamentos.</p>
                    </div>
                )}
            </div>

            <button className="home-button" onClick={handleVoltarHome}>
                Voltar para Home
            </button>

           

        </div>
    );
};

export default MeusAgendamentos; 