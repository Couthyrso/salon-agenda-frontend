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
    if (!data) return 'Data não definida';
    const dataObj = new Date(data);
    const opcoes = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return dataObj.toLocaleDateString('pt-BR', opcoes);
  };

  const formatarHorario = (appointment_date) => {
    if (!appointment_date) return 'Horário não definido';
    try {
      // Converte a string para um objeto Date
      const dataHora = new Date(appointment_date);
      
      // Verifica se a data é válida
      if (isNaN(dataHora.getTime())) {
        return 'Horário inválido';
      }

      // Formata o horário no padrão brasileiro (HH:mm)
      return dataHora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Erro ao formatar horário:', error);
      return 'Erro ao formatar horário';
    }
  };

  const filtrarAgendamentos = () => {
    return agendamentos.filter(agendamento => {
      const matchStatus = filtroStatus === 'todos' || agendamento.status === filtroStatus;
      const matchData = !filtroData || agendamento.appointment_date?.startsWith(filtroData);
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
              <p><strong>Cliente:</strong> {agendamento.user?.name || 'Cliente não identificado'}</p>
              <p><strong>Serviço:</strong> {agendamento.service?.name || agendamento.service_name}</p>
              <p><strong>Data:</strong> {formatarData(agendamento.appointment_date)}</p>
              <p><strong>Horário:</strong> {formatarHorario(agendamento.appointment_date)}</p>
              <p><strong>Preço do Serviço:</strong> R$ {agendamento.service?.price || agendamento.price || '0.00'}</p>
            </div>

            <div className="card-actions">
              <button 
                className="btn-detalhes"
                onClick={() => handleVerDetalhes(agendamento)}
              >
                Ver Detalhes
              </button>

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
              <p><strong>Cliente:</strong> {agendamentoSelecionado.user?.name || 'Cliente não identificado'}</p>
              <p><strong>Email:</strong> {agendamentoSelecionado.user?.email || 'Não disponível'}</p>
              <p><strong>Serviço:</strong> {agendamentoSelecionado.service?.name || agendamentoSelecionado.service_name}</p>
              <p><strong>Descrição do Serviço:</strong> {agendamentoSelecionado.service?.description || 'Não disponível'}</p>
              <p><strong>Duração:</strong> {agendamentoSelecionado.service?.duration || 'Não especificada'} min</p>
              <p><strong>Data:</strong> {formatarData(agendamentoSelecionado.appointment_date)}</p>
              <p><strong>Horário:</strong> {formatarHorario(agendamentoSelecionado.appointment_date)}</p>
              <p><strong>Preço do Serviço:</strong> R$ {agendamentoSelecionado.service?.price || agendamentoSelecionado.price || '0.00'}</p>
              <p><strong>Status:</strong> {agendamentoSelecionado.status}</p>
              <p><strong>Método de Pagamento:</strong> {agendamentoSelecionado.payment_method}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultaAdm;
