# AUTO ELECTRICAL MOZ - Backend Setup

## 📋 Índice
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Endpoints da API](#endpoints-da-api)
- [Deploy](#deploy)

## 🚀 Instalação

### Pré-requisitos
- Python 3.8+
- pip (gerenciador de pacotes Python)
- Git

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/danielacaciochumane5-collab/auto-electrical-moz.git
cd auto-electrical-moz/backend
```

2. **Crie um ambiente virtual**
```bash
python -m venv venv

# No Windows
venv\Scripts\activate

# No macOS/Linux
source venv/bin/activate
```

3. **Instale as dependências**
```bash
pip install -r requirements.txt
```

4. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Abra .env e preencha com seus dados
nano .env
```

## ⚙️ Configuração

### 1. Configurar Email (Gmail SMTP)

1. Acesse sua conta Google: https://myaccount.google.com/
2. Vá para "Segurança"
3. Ative "Autenticação de dois fatores"
4. Gere uma "Senha de Aplicativo"
5. Copie a senha e adicione ao `.env`:

```env
MAIL_USERNAME=seu_email@gmail.com
MAIL_PASSWORD=sua_senha_app_de_16_caracteres
```

### 2. Configurar WhatsApp Business API (Twilio)

1. Acesse https://www.twilio.com/
2. Crie uma conta ou faça login
3. Obtenha o `Account SID` e `Auth Token`
4. Adicione ao `.env`:

```env
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_WHATSAPP_NUMBER=seu_numero_whatsapp
```

### 3. Configurar Google Analytics

1. Acesse https://analytics.google.com/
2. Crie uma nova propriedade
3. Copie o ID de rastreamento (G-XXXXXXXXXX)
4. Adicione ao `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### 4. Inicializar Base de Dados

```bash
python
>>> from app import app, db
>>> with app.app_context():
>>>     db.create_all()
>>> exit()
```

Ou faça uma requisição POST:
```bash
curl -X POST http://localhost:5000/api/init-db
```

## 📖 Como Usar

### Iniciar o servidor

```bash
python app.py
```

O servidor iniciará em: `http://localhost:5000`

### Testes com cURL

**Criar um contacto:**
```bash
curl -X POST http://localhost:5000/api/contactos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "+258865860414",
    "mensagem": "Preciso de diagnóstico do meu carro"
  }'
```

**Listar contactos:**
```bash
curl http://localhost:5000/api/contactos
```

**Obter analytics:**
```bash
curl http://localhost:5000/api/analytics/resumo
```

## 🔌 Endpoints da API

### Contactos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/contactos` | Criar novo contacto |
| GET | `/api/contactos` | Listar todos contactos |
| GET | `/api/contactos/<id>` | Obter contacto específico |

### Email

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/verificar-email/<token>` | Verificar email |

### Galeria

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/galeria` | Listar fotos |
| POST | `/api/galeria` | Adicionar foto |

### Blog

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/blog` | Listar artigos |
| GET | `/api/blog/<id>` | Obter artigo específico |
| POST | `/api/blog` | Criar artigo |

### Analytics

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/analytics/resumo` | Resumo de analytics |

### Sistema

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Verificar saúde da API |
| POST | `/api/init-db` | Inicializar base de dados |

## 📊 Exemplo de Resposta

**Sucesso ao criar contacto:**
```json
{
  "sucesso": true,
  "mensagem": "Contacto recebido com sucesso!",
  "contacto": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "+258865860414",
    "mensagem": "Preciso de diagnóstico...",
    "data_criacao": "2026-09-07T20:45:00",
    "email_verificado": false
  }
}
```

**Erro:**
```json
{
  "erro": "Email inválido"
}
```

## 🌐 Deploy

### Opção 1: Heroku

1. Instale o Heroku CLI
2. Crie um arquivo `Procfile`:
```
web: gunicorn app:app
```

3. Faça o deploy:
```bash
heroku login
heroku create seu-app-name
git push heroku main
```

### Opção 2: PythonAnywhere

1. Acesse https://www.pythonanywhere.com/
2. Crie uma conta
3. Upload do código
4. Configure a aplicação Flask
5. Reinicie

### Opção 3: DigitalOcean/AWS

1. Crie um servidor
2. Instale Python e pip
3. Clone o repositório
4. Configure o nginx como reverse proxy
5. Use systemd para gerenciar o serviço

## 🔐 Segurança

- ✅ Validação de todos os inputs
- ✅ Proteção contra CORS
- ✅ Senha do SECRET_KEY deve ser forte
- ✅ Use HTTPS em produção
- ✅ Mantenha `.env` fora do Git (adicionar a `.gitignore`)

## 📱 Estrutura do Projeto

```
backend/
├── app.py                 # Aplicação Flask principal
├── requirements.txt       # Dependências Python
├── .env.example          # Template de variáveis
└── README.md             # Este arquivo
```

## 🆘 Troubleshooting

**Erro: "ModuleNotFoundError"**
```bash
# Certifique-se que o ambiente virtual está ativo
source venv/bin/activate  # macOS/Linux
# ou
venv\Scripts\activate     # Windows
```

**Erro: "CORS error"**
- O frontend e backend devem estar na mesma origem ou CORS deve estar configurado

**Email não envia**
- Verifique as credenciais do Gmail
- Ative "Aplicações menos seguras" se necessário
- Use "Senha de Aplicativo" e não a senha normal

## 📞 Suporte

Para dúvidas ou problemas, entre em contacto:
- WhatsApp: +258 865 860 414
- Email: contacto@autoelectricalmoz.com

---

**Desenvolvido com ❤️ por AUTO ELECTRICAL MOZ**
