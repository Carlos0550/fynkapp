import React from 'react';
import './UserDashboard.css'; // Suponiendo que usarás CSS para el estilo

const UserDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Panel de Control</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>Clientes atrasados</h2>
          <p>15</p>
        </div>
        <div className="dashboard-card">
          <h2>Total de este mes</h2>
          <p>$55,000</p>
        </div>
        {/* Puedes duplicar estas tarjetas y cambiar el contenido segun necesites */}
        <div className="dashboard-card">
          <h2>Nuevos Clientes Este Mes</h2>
          <p>10</p>
        </div>
        <div className="dashboard-card">
          <h2>Facturas Pendientes</h2>
          <p>5</p>
        </div>
        <div className="dashboard-card">
          <h2>Proyectos Completados</h2>
          <p>12</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
