// components/point/PointRegister.jsx
import React, { useState } from 'react';
import Button from '@/common/Button';
import { useGeolocation } from '@/hooks/useGeolocation';

const eventLabels = {
  entry: 'Entrada',
  break_start: 'Início intervalo',
  break_end: 'Fim intervalo',
  exit: 'Saída',
  ot_start: 'Início Hora Extra',
  ot_end: 'Fim Hora Extra'
};

const PointRegister = () => {
  const [event, setEvent] = useState('entry');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [location, askLocation] = useGeolocation();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const { latitude, longitude } = await askLocation();
      const token = localStorage.getItem('accessToken');
      const resp = await fetch('/api/points/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event,
          latitude,
          longitude
        })
      });
      const data = await resp.json();
      setResult(data.ok ? "Ponto registrado em " + data.timestamp : data.message);
    } catch (err) {
      setResult("Erro: " + err);
    }
    setLoading(false);
  };

  return (
    <div>
      <label type="event">Tipo de Ponto</label>
      <select value={event} onChange={e => setEvent(e.target.value)}>
        {Object.keys(eventLabels).map(ev => (
          <option value={ev} key={ev}>{eventLabels[ev]}</option>
        ))}
      </select>
      <Button onClick={handleRegister} disabled={loading}>
        {loading ? "Registrando..." : "Registrar Ponto"}
      </Button>
      <div style={{marginTop: 14, color: 'green'}}>{result}</div>
    </div>
  );
};

export default PointRegister;

