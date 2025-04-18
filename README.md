# Auth Service

Serviço de autenticação para a plataforma educacional baseada em microsserviços.

## Funcionalidades

- Registro de usuários
- Login de usuários
- Geração de tokens JWT para autenticação entre serviços
- Validação de tokens

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- Bcrypt para criptografia de senhas

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env`
4. Execute o servidor de desenvolvimento:
   ```
   npm run dev
   ```

## Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar um novo usuário
- `POST /api/auth/login` - Autenticar usuário e obter token

## Testes

Execute os testes automatizados com:

```
npm test
``` 