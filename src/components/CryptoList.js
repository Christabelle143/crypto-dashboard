import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptos } from '../features/cryptoSlice';

const CryptoList = () => {
  const dispatch = useDispatch();
  const { cryptos, status, error } = useSelector((state) => state.crypto);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCryptos());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Cryptocurrencies</h2>
      <ul>
        {cryptos.map((crypto) => (
          <li key={crypto.id}>
            <span>{crypto.name}</span>
            <span> - ${crypto.current_price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CryptoList;