// frontend/src/pages/HomePage.jsx
import React from 'react';
import Card from '../components/Card';
import Icon from '../components/Icon';
import './HomePage.css';

const HomePage = () => (
  <div className="homepage__grid">
    <Card
      header={<Icon name="user" size={32} color="#4A90E2" />}
      footer="Ver Perfil"
      onClick={() => console.log('Perfil clicado')}
    >
      <h3>Bem-vindo, Usuário!</h3>
      <p>Acesse seus registros e notificações.</p>
    </Card>

    <Card
      header={<Icon name="clock" size={32} color="#7ED321" />}
      footer="Registrar Ponto"
      onClick={() => console.log('Registro de ponto')}
    >
      <h3>Registro de Ponto</h3>
      <p>Registre seu ponto com um toque e capture data, hora e localização.</p>
    </Card>
    {/* Outros cards para Documentos, Compras, Chat, etc. */}
  </div>
);

export default HomePage;
