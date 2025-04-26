import React, { useState } from 'react';
import './agendamento.css'; // vamos colocar o CSS separado, igual seu home.css

const Agendamento = () => {
  const [etapa, setEtapa] = useState(1);
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [cartao, setCartao] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(false);

  const horarios = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  const formatarData = (dataISO) => {
    if (!dataISO) return '';
    const partes = dataISO.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const confirmarAgendamento = () => {
    if (!data || !hora) {
      setErro(true);
      setMensagem('Por favor, selecione a data e o horário!');
      return;
    }
    setErro(false);
    setMensagem('');
    setEtapa(2);
  };

  const pagar = () => {
    setErro(false);
    setMensagem('');
    setTimeout(() => {
      setEtapa(3);
    }, 1500);
  };

  return (
    <div className="container">
      {etapa === 1 && (
        <>
          <h1>Agendamento</h1>

          <label>Selecione a data:</label>
          <input 
            type="date" 
            value={data} 
            min="2024-01-01" 
            max="2030-12-31"
            onChange={(e) => setData(e.target.value)}
          />

          <label>Selecione o horário:</label>
          <select value={hora} onChange={(e) => setHora(e.target.value)}>
            <option value="">Selecione o horário</option>
            {horarios.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <button onClick={confirmarAgendamento}>Confirmar Agendamento</button>

          {mensagem && (
            <div className={`message ${erro ? 'error' : 'success'}`}>
              {mensagem}
            </div>
          )}
        </>
      )}

      {etapa === 2 && (
        <>
          <h1>Pagamento</h1>
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Valor a pagar: R$ 100,00
          </p>



          <button onClick={pagar}>Pagar</button>

          {mensagem && (
            <div className={`message ${erro ? 'error' : 'success'}`}>
              {mensagem}
            </div>
          )}
        </>
      )}

      {etapa === 3 && (
        <>
          <h1>Sucesso!</h1>
          <div className="message success">
            Agendamento concluído para o dia <strong>{formatarData(data)}</strong> às <strong>{hora}</strong> horas!
          </div>
        </>
      )}
    </div>
  );
};

export default Agendamento;