import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite, setSearchQuery, toggleSortOrder } from "../features/cryptoSlice";
import { FixedSizeList as List } from "react-window";

const CryptoList = () => {
  const dispatch = useDispatch();
  const { favorites, searchQuery, sortOrder } = useSelector((state) => state.crypto);
  const [cryptos, setCryptos] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Connect to WebSocket (Example: Binance API)
    const socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const updatedCrypto = {
        id: "bitcoin",
        name: "Bitcoin",
        current_price: parseFloat(data.p), // Price from WebSocket
      };

      setCryptos((prevCryptos) => {
        const index = prevCryptos.findIndex((c) => c.id === updatedCrypto.id);
        if (index !== -1) {
          const updatedList = [...prevCryptos];
          updatedList[index] = updatedCrypto;
          return updatedList;
        } else {
          return [...prevCryptos, updatedCrypto];
        }
      });
    };

    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onclose = () => console.log("WebSocket disconnected");

    setWs(socket);

    return () => {
      socket.close(); // Cleanup WebSocket on component unmount
    };
  }, []);

  // Filter & Sort Cryptos
  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCryptos = filteredCryptos.sort((a, b) =>
    sortOrder === "asc" ? a.current_price - b.current_price : b.current_price - a.current_price
  );

  const handleFavorite = (id) => dispatch(toggleFavorite(id));

  // Prevent unnecessary re-renders
  const Row = useCallback(
    ({ index, style }) => {
      const crypto = sortedCryptos[index];
      return (
        <div style={{ ...style, padding: "10px", borderBottom: "1px solid #ddd" }}>
          <span>{crypto.name} - ${crypto.current_price.toFixed(2)}</span>
          <button onClick={() => handleFavorite(crypto.id)} style={{ marginLeft: "10px" }}>
            {favorites.includes(crypto.id) ? "Unfavorite" : "Favorite"}
          </button>
        </div>
      );
    },
    [sortedCryptos, favorites]
  );

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
              <span>{favoriteCrypto.name} - ${favoriteCrypto.current_price.toFixed(2)}</span>
            </li>
          ) : null;
        })}
      </ul>
    </div>
  );
};

export default CryptoList;
