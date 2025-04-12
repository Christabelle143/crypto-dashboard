// src/components/CryptoChartModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CryptoChartModal = ({ crypto, open, onClose }) => {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    if (crypto && open) {
      const fetchHistoricalData = async () => {
        try {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${crypto.id}/market_chart?vs_currency=usd&days=7`
          );
          const data = await response.json();
  
          const formattedData = data.prices.map(([timestamp, price]) => {
            const date = new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return { date, price: parseFloat(price.toFixed(2)) };
          });
  
          setHistoricalData(formattedData);
        } catch (error) {
          console.error("Error fetching historical data:", error);
        }
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
