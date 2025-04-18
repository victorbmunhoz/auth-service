const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const User = require('../models/User');

let mongoServer;
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Testes de Autenticação', () => {
  describe('POST /api/auth/register', () => {
    it('deve registrar um novo usuário', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Usuário Teste',
          email: 'teste@example.com',
          password: 'senha123',
          role: 'student'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toEqual('teste@example.com');
    });

    it('deve retornar erro se o usuário já existir', async () => {
      // Primeiro cria o usuário
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Usuário Teste',
          email: 'teste@example.com',
          password: 'senha123',
          role: 'student'
        });

      // Tenta criar novamente
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Usuário Teste',
          email: 'teste@example.com',
          password: 'senha123',
          role: 'student'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve fazer login com credenciais corretas', async () => {
      // Primeiro cria o usuário
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Usuário Teste',
          email: 'teste@example.com',
          password: 'senha123',
          role: 'student'
        });

      // Tenta fazer login
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'teste@example.com',
          password: 'senha123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toEqual('teste@example.com');
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