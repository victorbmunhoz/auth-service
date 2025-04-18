const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const jwt = require('jsonwebtoken');
const authRoutes = require('../routes/authRoutes');
const User = require('../models/User');

// Configurar variáveis de ambiente necessárias para os testes
process.env.JWT_SECRET = 'segredo_para_testes';
process.env.JWT_EXPIRATION = '1h';

let mongoServer;
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

// Capturar erros no Express para não quebrar os testes
app.use((err, req, res, next) => {
  console.error('Erro no teste:', err);
  res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Configurar opções para evitar avisos de depreciação
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  
  try {
    await mongoose.connect(mongoUri);
    console.log(`MongoDB conectado em: ${mongoUri}`);
  } catch (error) {
    console.error('Erro ao conectar com MongoDB:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('Conexão com MongoDB encerrada');
  } catch (error) {
    console.error('Erro ao desconectar do MongoDB:', error);
  }
});

beforeEach(async () => {
  try {
    await User.deleteMany({});
    console.log('Coleção de usuários limpa');
  } catch (error) {
    console.error('Erro ao limpar coleção de usuários:', error);
  }
});

describe('Testes de Autenticação', () => {
  describe('POST /api/auth/register', () => {
    it('deve registrar um novo usuário', async () => {
      try {
        const userData = {
          name: 'Usuário Teste',
          email: 'teste@example.com',
          password: 'senha123',
          role: 'student'
        };
        
        console.log('Enviando requisição de registro:', userData);
        
        const res = await request(app)
          .post('/api/auth/register')
          .send(userData);
        
        console.log('Resposta do registro:', res.status, res.body);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.email).toEqual('teste@example.com');
      } catch (error) {
        console.error('Erro no teste de registro:', error);
        throw error;
      }
    });

    it('deve retornar erro se o usuário já existir', async () => {
      const userData = {
        name: 'Usuário Teste',
        email: 'teste@example.com',
        password: 'senha123',
        role: 'student'
      };
      
      // Primeiro cria o usuário
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Tenta criar novamente
      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve fazer login com credenciais corretas', async () => {
      try {
        const userData = {
          name: 'Usuário Teste',
          email: 'teste@example.com',
          password: 'senha123',
          role: 'student'
        };
        
        // Primeiro cria o usuário
        const registerRes = await request(app)
          .post('/api/auth/register')
          .send(userData);
          
        console.log('Usuário criado para teste de login:', registerRes.status, registerRes.body);
  
        // Tenta fazer login
        const loginData = {
          email: 'teste@example.com',
          password: 'senha123'
        };
        
        console.log('Enviando requisição de login:', loginData);
        
        const res = await request(app)
          .post('/api/auth/login')
          .send(loginData);
          
        console.log('Resposta do login:', res.status, res.body);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toEqual('teste@example.com');
      } catch (error) {
        console.error('Erro no teste de login:', error);
        throw error;
      }
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'naoexiste@example.com',
          password: 'senha123'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message');
    });
  });
}); 