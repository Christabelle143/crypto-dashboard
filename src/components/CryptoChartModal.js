// src/components/CryptoChartModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CryptoChartModal = ({ crypto, open, onClose }) => {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    if (crypto && open) {
      const fetchHistoricalData = async () => {
        // Replace this with your API or service for fetching historical data
        const response = await fetch(`/api/cryptos/${crypto.id}/history?days=7`);
        const data = await response.json();
        setHistoricalData(data);
      };
      fetchHistoricalData();
    }
  }, [crypto, open]);

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: '20px', backgroundColor: 'white', margin: '50px auto', width: '80%' }}>
        <h2>{crypto.name} - Historical Prices (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default CryptoChartModal;
