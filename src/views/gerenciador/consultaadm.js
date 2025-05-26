import React, { useEffect, useState } from 'react';
import './consultaadm.css';

const ConsultaAdm = () => {
  const [agendamentos, setAgendamentos] = useState([]);

  // Simulação de dados do backend
  useEffect(() => {
    const mockData = [
      { id: 1, cliente: 'Maria Silva', servico: 'Corte de cabelo', data: '2025-05-25', horario: '14:00', status: 'Confirmado' },
      { id: 2, cliente: 'João Souza', servico: 'Manicure', data: '2025-05-26', horario: '09:30', status: 'Pendente' },
      { id: 3, cliente: 'Ana Costa', servico: 'Coloração', data: '2025-05-27', horario: '11:00', status: 'Cancelado' },
    ];
    setAgendamentos(mockData);
  }, []);

  return (
    <div className="container">
      <h1>Gerenciamento de Agendamentos</h1>
      <table className="agendamentos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.map(({id, cliente, servico, data, horario, status}) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{cliente}</td>
              <td>{servico}</td>
              <td>{data}</td>
              <td>{horario}</td>
              <td>{status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultaAdm;
