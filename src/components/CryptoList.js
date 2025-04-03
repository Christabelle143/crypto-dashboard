import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCryptos, toggleFavorite, setSearchQuery, toggleSortOrder } from "../features/cryptoSlice";
import { FixedSizeList as List } from "react-window";

const CryptoList = () => {
  const dispatch = useDispatch();
  const { cryptos, favorites, searchQuery, sortOrder, status, error } = useSelector((state) => state.crypto);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCryptos());
    }
  }, [dispatch, status]);

  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCryptos = filteredCryptos.sort((a, b) =>
    sortOrder === "asc" ? a.current_price - b.current_price : b.current_price - a.current_price
  );

  const handleFavorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  // Function to render each row
  const Row = ({ index, style }) => {
    const crypto = sortedCryptos[index];
    return (
      <div style={{ ...style, padding: "10px", borderBottom: "1px solid #ddd" }}>
        <span>{crypto.name} - ${crypto.current_price}</span>
        <button onClick={() => handleFavorite(crypto.id)} style={{ marginLeft: "10px" }}>
          {favorites.includes(crypto.id) ? "Unfavorite" : "Favorite"}
        </button>
      </div>
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Cryptos..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      />
      <button onClick={() => dispatch(toggleSortOrder())}>
        Sort by Price ({sortOrder === "asc" ? "Ascending" : "Descending"})
      </button>

      <h2>Cryptocurrencies</h2>
      <div style={{ height: "500px", width: "100%" }}>
        <List height={500} itemCount={sortedCryptos.length} itemSize={50} width="100%">
          {Row}
        </List>
      </div>

      <h2>Favorites</h2>
      <ul>
        {favorites.map((id) => {
          const favoriteCrypto = cryptos.find((crypto) => crypto.id === id);
          return favoriteCrypto ? (
            <li key={id}>
              <span>{favoriteCrypto.name} - ${favoriteCrypto.current_price}</span>
            </li>
          ) : null;
        })}
      </ul>
    </div>
  );
};

export default CryptoList;

