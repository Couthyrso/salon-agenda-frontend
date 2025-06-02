import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './consultaadm.css';
import api from '../../services/api';

const ConsultaAdm = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroData, setFiltroData] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      // Aqui você deve substituir pela chamada real à sua API
      const response = await api.get('/api/appointments');
      setAgendamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, novoStatus) => {
    try {
      await api.put(`/api/appointments/${id}`, { status: novoStatus });
      toast.success('Status atualizado com sucesso!');
      carregarAgendamentos();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleExcluirAgendamento = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await api.delete(`/api/appointments/${id}`);
        toast.success('Agendamento excluído com sucesso!');
        carregarAgendamentos();
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        toast.error('Erro ao excluir agendamento');
      }
    }
  };

  const handleVerDetalhes = (agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setShowModal(true);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const filtrarAgendamentos = () => {
    return agendamentos.filter(agendamento => {
      const matchStatus = filtroStatus === 'todos' || agendamento.status === filtroStatus;
      const matchData = !filtroData || agendamento.data === filtroData;
      return matchStatus && matchData;
    });
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="consulta-container">
      <ToastContainer />
      <h1>Gerenciamento de Agendamentos</h1>

      <div className="filtros">
        <div className="filtro-grupo">
          <label>Status:</label>
          <select 
            value={filtroStatus} 
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label>Data:</label>
          <input 
            type="date" 
            value={filtroData} 
            onChange={(e) => setFiltroData(e.target.value)}
          />
        </div>
      </div>

      <div className="agendamentos-grid">
        {filtrarAgendamentos().map((agendamento) => (
          <div key={agendamento.id} className="agendamento-card">
            <div className="card-header">
              <h3>Agendamento #{agendamento.id}</h3>
              <span className={`status-badge ${agendamento.status}`}>
                {agendamento.status}
              </span>
            </div>
            
            <div className="card-body">
              <p><strong>Cliente:</strong> {agendamento.cliente}</p>
              <p><strong>Serviço:</strong> {agendamento.servico}</p>
              <p><strong>Data:</strong> {formatarData(agendamento.data)}</p>
              <p><strong>Horário:</strong> {agendamento.horario}</p>
              <p><strong>Preço:</strong> R$ {agendamento.preco?.toFixed(2)}</p>
            </div>

            <div className="card-actions">
              <button 
                className="btn-detalhes"
                onClick={() => handleVerDetalhes(agendamento)}
              >
                Ver Detalhes
              </button>
              
              <select 
                className="status-select"
                value={agendamento.status}
                onChange={(e) => handleStatusChange(agendamento.id, e.target.value)}
              >
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
                <option value="concluido">Concluído</option>
              </select>

              <button 
                className="btn-excluir"
                onClick={() => handleExcluirAgendamento(agendamento.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && agendamentoSelecionado && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Detalhes do Agendamento</h2>
              <button 
                className="btn-fechar"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <p><strong>ID:</strong> {agendamentoSelecionado.id}</p>
              <p><strong>Cliente:</strong> {agendamentoSelecionado.cliente}</p>
              <p><strong>Serviço:</strong> {agendamentoSelecionado.servico}</p>
              <p><strong>Data:</strong> {formatarData(agendamentoSelecionado.data)}</p>
              <p><strong>Horário:</strong> {agendamentoSelecionado.horario}</p>
              <p><strong>Preço:</strong> R$ {agendamentoSelecionado.preco?.toFixed(2)}</p>
              <p><strong>Status:</strong> {agendamentoSelecionado.status}</p>
              <p><strong>Método de Pagamento:</strong> {agendamentoSelecionado.metodoPagamento}</p>
              <p><strong>Observações:</strong> {agendamentoSelecionado.observacoes || 'Nenhuma'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultaAdm;
