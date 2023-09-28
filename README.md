# Autenticador-nodejs:

Autenticador-nodejs é uma API de 2FA super simples.

- Usa banco de dados postgres, mas tem a opção de usar mysql.
- O envio de email é feito pelo serviço da [Brevo](https://www.brevo.com/), mas você pode mudar o serviço (talvez precise de mudanças no código).
- A API funciona com o google button e facebook button (basta enviar as informações necessárias).

## Development

1. Adicionar arquivo .env e as váriaveis de ambiente 
```
PORT={{porta}}

NODE_ENV=development

MYSQL_URL={{url do banco}}
POSTGRES_URL={{url do banco}}

SITE_URL={{url do site ex.:http://localhost:3000}}

JWT_SECRET_KEY={{secret do jwt}}
SESSION_SECRET={{secret da session}}

NODEMAILER_HOST={{serviço host}}
NODEMAILER_PORT={{serviço porta}}
NODEMAILER_USER={{serviço usuário}}
NODEMAILER_PASS={{serviço senha}}
```
2. Instalar dependências
```
npm install
```
3. Rodar o comando dev
```
npm run dev
```

## Production

1. Adicionar arquivo .env e as váriaveis de ambiente 
```
PORT={{porta}}

NODE_ENV=production

MYSQL_URL={{url do banco}}
POSTGRES_URL={{url do banco}}

SITE_URL={{url do site ex.:http://localhost:3000}}

JWT_SECRET_KEY={{secret do jwt}}
SESSION_SECRET={{secret da session}}

NODEMAILER_HOST={{serviço host}}
NODEMAILER_PORT={{serviço porta}}
NODEMAILER_USER={{serviço usuário}}
NODEMAILER_PASS={{serviço senha}}
```
2. Instalar dependências
```
npm install
```
3. Rodar o comando de build
```
npm run build
```
4. Rodar o comando de iniciar
```
npm run start
```

## Rotas:

### Login

- POST **/login**               *(body: email e password) ou (body: email, sub)*
- POST **/register**            *(body: name, email, password, password_confirmation) ou (body: name, email, sub)*
- GET  **/logout**

 > **/login** faz o login do usuário
 > **/register** cadastra a conta do usuário
 > **/logout** invalida a sessão e a autorização do email

### Email

- GET  **/confirmemail**        *(query string: confirm={{token}})*
- GET  **/confirm_changeemail** *(query string: confirm_changeemail={{token}})*
- GET  **/refuse_changeemail**  *(query string: refuse_changeemail={{token}})*
- GET  **/emaildemo**

> **/confirmemail** confirma a autenticação por email
> **/confirm_changeemail** confirma a mudança de email
> **/refuse_changeemail** recusa a mudança de email
> **/emaildemo** confirma a autenticação email para não ter que acessar o email

### Config

- POST **/config**              *(body: name<sup>opcional</sup>, email<sup>opcional</sup>, new_password<sup>opcional</sup>, current_password<sup>opcional</sup>)*
- POST **/deleteuser**          *(body: password)*

> **/config** muda os dados do usuário
> **/deleteuser** deleta a conta do usuário

> [!IMPORTANT]
> Na rota /config, se o usuário foi criado com sub, não tiver senha e você quiser adicionar uma, basta enviar o campo new_password.

### Home

- GET  **/**

> **/** demostra que usuário tem acesso a rota, mostra seu nome e email