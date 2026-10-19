const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const app = express();

const clientId = 'cole seu id do cliente aqui';
const clientSecret = 'cole seu segredo do cliente aqui';
const redirectUri = 'http://localhost:3000';

const client = new OAuth2Client(
  clientId,
  clientSecret,
  redirectUri
);

// Permite requisições do frontend React
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.post('/api/auth/google', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      error: 'Código de autorização não informado.'
    });
  }

  try {
    // Troca o código de autorização pelos tokens do Google
    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      return res.status(401).json({
        error: 'ID token não recebido do Google.'
      });
    }

    // Valida o ID token recebido
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    });

    const payload = ticket.getPayload();

    const userId = payload.sub;

    // Cria o JWT da aplicação
    const jwtToken = jwt.sign(
      {
        userId,
        name: payload.name,
        email: payload.email,
      },
      'secret_key',
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({ jwtToken });
  } catch (error) {
    console.error('Erro ao autenticar com o Google:', error);

    res.status(401).json({
      error: 'Não foi possível autenticar com o Google.',
      details: error.message
    });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});