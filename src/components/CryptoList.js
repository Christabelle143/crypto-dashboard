import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptos, toggleFavorite, setSearchQuery, toggleSortOrder } from '../features/cryptoSlice';

const CryptoList = () => {
  const dispatch = useDispatch();
  const { cryptos, favorites, searchQuery, sortOrder, status, error } = useSelector((state) => state.crypto);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCryptos());
    }
  }, [dispatch, status]);

 
  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const sortedCryptos = filteredCryptos.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.current_price - b.current_price;
    }
    return b.current_price - a.current_price;
  });

 
  const handleFavorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search Cryptos..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      />
      <button onClick={() => dispatch(toggleSortOrder())}>
        Sort by Price ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>

      <h2>Cryptocurrencies</h2>
      <ul>
        {sortedCryptos.map((crypto) => (
          <li key={crypto.id}>
            <span>{crypto.name}</span>
            <span> - ${crypto.current_price}</span>
            <button onClick={() => handleFavorite(crypto.id)}>
              {favorites.includes(crypto.id) ? 'Unfavorite' : 'Favorite'}
            </button>
          </li>
        ))}
      </ul>

      <h2>Favorites</h2>
      <ul>
        {favorites.map((id) => {
          const favoriteCrypto = cryptos.find((crypto) => crypto.id === id);
          return (
            <li key={id}>
              <span>{favoriteCrypto.name}</span> - ${favoriteCrypto.current_price}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CryptoList;
