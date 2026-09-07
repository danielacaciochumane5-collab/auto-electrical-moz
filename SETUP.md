# ⚙️ Guia de Setup Completo - AUTO ELECTRICAL MOZ

Tudo o que você precisa saber para configurar o projeto do zero.

---

## 📋 Pré-requisitos

### Para Frontend
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Editor de texto (VS Code, Sublime, etc)
- Git (opcional, para clonar repo)

### Para Backend
- Python 3.8+ instalado
- pip (gerenciador de pacotes Python)
- Git

---

## 🔧 Instalação Passo a Passo

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/danielacaciochumane5-collab/auto-electrical-moz.git
cd auto-electrical-moz
```

### 2️⃣ Setup do Frontend

O frontend é apenas arquivos HTML/CSS/JS, não precisa de instalação!

```bash
# Opção 1: Abrir index.html diretamente (simples)
open index.html  # macOS
start index.html # Windows
# ou clicar 2x no arquivo

# Opção 2: Usar servidor local Python (recomendado)
python -m http.server 8000
# Depois acesse: http://localhost:8000
```

### 3️⃣ Setup do Backend

```bash
# Entre na pasta backend
cd backend

# Crie ambiente virtual Python
python -m venv venv

# Ative o ambiente virtual
# No Windows:
venv\Scripts\activate
# No macOS/Linux:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Copie o arquivo de configuração
cp .env.example .env

# Abra .env com um editor e preencha com seus dados
# (Edite: MAIL_USERNAME, MAIL_PASSWORD, TWILIO_*, etc)
nano .env  # ou use VS Code

# Inicie o servidor
python app.py
```

---

## 🔐 Configurações Necessárias

### Gmail SMTP (para enviar emails)

1. Acesse https://myaccount.google.com/
2. Clique em "Segurança" no menu esquerdo
3. Ative "Autenticação de dois fatores" se não tiver
4. Procure por "Senhas de aplicativo"
5. Escolha "Mail" e "Windows Computer"
6. Copie a senha gerada (16 caracteres)
7. Cole em `.env`:
   ```env
   MAIL_USERNAME=seu_email@gmail.com
   MAIL_PASSWORD=sua_senha_de_16_caracteres
   ```

### Google Analytics (para rastrear visitantes)

1. Acesse https://analytics.google.com/
2. Clique em "Começar"
3. Preencha informações
4. Crie uma "Propriedade"
5. Copie o ID (G-XXXXXXXXXX)
6. Cole em `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

### Twilio WhatsApp (opcional, para integração WhatsApp)

1. Acesse https://www.twilio.com/
2. Crie conta
3. Vá a Console
4. Copie "Account SID" e "Auth Token"
5. Ative WhatsApp Sandbox
6. Cole em `.env`:
   ```env
   TWILIO_ACCOUNT_SID=seu_account_sid
   TWILIO_AUTH_TOKEN=seu_auth_token
   TWILIO_WHATSAPP_NUMBER=seu_numero
   ```

---

## ✅ Verificar Instalação

### Frontend
1. Abra http://localhost:8000 no navegador
2. Clique no botão da lua (deve mudar de modo)
3. Preencha o formulário de contacto
4. Verifique se tem validação

### Backend
1. Abra http://localhost:5000/api/health no navegador
2. Deve ver: `{"status": "ok", "message": "AUTO ELECTRICAL MOZ API está online!"}`

### Integração Frontend + Backend
1. Verifique se `API_URL` em `script.js` está correto
2. Preencha o formulário
3. Clique em "Enviar mensagem"
4. Deve redirecionar para WhatsApp

---

## 📁 Estrutura de Pastas Explicada

```
auto-electrical-moz/
├── index.html           # Página principal do site
├── styles.css           # Todos os estilos (cores, layout, responsive)
├── script.js            # Interatividade e integração com API
│
├── backend/
│   ├── app.py           # Servidor Python (API)
│   ├── requirements.txt  # Lista de bibliotecas Python
│   ├── .env.example     # Template de variáveis (copie para .env)
│   ├── Procfile         # Para deploy no Heroku
│   └── README.md        # Documentação do backend
│
├── README.md            # Este arquivo (instruções gerais)
├── SETUP.md             # Este documento (setup detalhado)
├── DEPLOY.md            # Instruções de publicar online
└── .gitignore           # Arquivos que não fazer upload no Git
```

---

## 🎓 O que Cada Arquivo Faz

### `index.html`
- Contém todo o conteúdo do site (texto, imagens, formulário)
- Define a estrutura HTML

### `styles.css`
- Define como tudo fica visual (cores, tamanhos, espaçamento)
- Faz o site ficar bonito em móvel, tablet e desktop

### `script.js`
- Faz o site interativo (modo escuro, validação de formulário)
- Conecta com a API backend
- Rastreia eventos (Google Analytics)

### `backend/app.py`
- É um servidor que recebe dados do formulário
- Salva em base de dados
- Envia emails
- Integra com WhatsApp

---

## 🚀 Próximos Passos

1. **Testar localmente** - Certifique-se que tudo funciona no seu computador
2. **Fazer primeiro deploy** - Colocar online (veja `DEPLOY.md`)
3. **Adicionar fotos reais** - Substituir placeholders na galeria
4. **Registrar no Google Search Console** - Melhorar SEO
5. **Divulgar nas redes sociais** - Conquistar clientes!

---

## 🆘 Erros Comuns e Soluções

### "ModuleNotFoundError: No module named 'flask'"
```bash
# Solução: Ativar ambiente virtual e instalar:
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements.txt
```

### "CORS error" ou "Failed to fetch"
```bash
# Solução: Verificar:
# 1. API_URL em script.js está correto
# 2. Backend está rodando em http://localhost:5000
# 3. CORS está habilitado no app.py (já está)
```

### "Email não envia"
```bash
# Solução:
# 1. Verificar MAIL_USERNAME e MAIL_PASSWORD em .env
# 2. Usar "Senha de Aplicativo" e não senha normal do Gmail
# 3. Verificar se 2FA está ativo no Gmail
```

### "Base de dados não encontrada"
```bash
# Solução: Inicializar BD
curl -X POST http://localhost:5000/api/init-db
# Ou:
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

---

## 📚 Recursos Úteis

- Python: https://www.python.org/
- Flask: https://flask.palletsprojects.com/
- HTML/CSS: https://www.w3schools.com/
- Git: https://git-scm.com/
- GitHub: https://github.com/

---

## 💡 Dicas Profissionais

1. **Use VS Code** - Editor perfeito para este projeto
2. **Instale extensão Python** - Facilita desenvolvimento
3. **Use Git** - Controle de versão é essencial
4. **Faça backup** - Sempre tenha cópia de segurança
5. **Teste em móvel** - Use DevTools do navegador (F12)

---

## ✨ Quando Tudo Funciona

✅ Site abre no navegador  
✅ Modo escuro/claro funciona  
✅ Formulário valida dados  
✅ WhatsApp abre ao enviar  
✅ Email de confirmação chega  
✅ Analytics rastreia eventos  
✅ Responsividade OK  
✅ Site bonito em móvel  

---

**Parabéns! Você tem um site profissional rodando! 🎉**

Agora é só fazer deploy (veja `DEPLOY.md`) e conquistar clientes!
