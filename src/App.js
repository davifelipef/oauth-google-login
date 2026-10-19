import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const App = () => {
  const [user, setUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(
    localStorage.getItem('jwtToken') || ''
  );

  const clientId = 'cole seu id do cliente aqui';
  const redirectUri = 'http://localhost:3000';

  useEffect(() => {
    if (jwtToken) {
      try {
        const decodedToken = jwtDecode(jwtToken);
        setUser(decodedToken);
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        localStorage.removeItem('jwtToken');
        setJwtToken('');
        setUser(null);
      }
    }
  }, [jwtToken]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      return;
    }

    handleTokenExchange(code);

    window.history.replaceState({}, document.title, redirectUri);
  }, []);

  const handleGoogleLogin = () => {
    const authUrl =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      '&response_type=code' +
      '&scope=openid%20profile%20email';

    window.location.href = authUrl;
  };

  const handleTokenExchange = async (code) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/google',
        { code }
      );

      const { jwtToken } = response.data;

      localStorage.setItem('jwtToken', jwtToken);
      setJwtToken(jwtToken);
    } catch (error) {
      console.error('Erro ao trocar código de autorização:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setJwtToken('');
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <>
          <h2>Bem-vindo, {user.name || user.userId}</h2>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleGoogleLogin}>
          Login com Google
        </button>
      )}
    </div>
  );
};

export default App;
