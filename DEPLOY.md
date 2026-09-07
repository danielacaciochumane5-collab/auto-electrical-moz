# 🚀 Guia de Deploy - AUTO ELECTRICAL MOZ

## Deploy Rápido (Passo a Passo)

### Opção 1: Heroku (RECOMENDADO - Mais Fácil)

#### Passo 1: Criar Conta Heroku
1. Acesse https://www.heroku.com/
2. Clique em "Sign Up" e crie uma conta
3. Confirme seu email

#### Passo 2: Instalar Heroku CLI
```bash
# Windows, macOS ou Linux
# Acesse: https://devcenter.heroku.com/articles/heroku-cli
# Ou use:
# macOS: brew install heroku/brew/heroku
# Windows: choco install heroku-cli
```

#### Passo 3: Fazer Login
```bash
heroku login
# Vai abrir navegador para autenticar
```

#### Passo 4: Criar App
```bash
cd auto-electrical-moz/backend
heroku create seu-app-name
# Exemplo: heroku create auto-electrical-moz-api
```

#### Passo 5: Configurar Variáveis de Ambiente
```bash
heroku config:set FLASK_ENV=production
heroku config:set SECRET_KEY=sua_chave_super_segura
heroku config:set MAIL_USERNAME=seu_email@gmail.com
heroku config:set MAIL_PASSWORD=sua_senha_app
heroku config:set DATABASE_URL=postgresql://...
```

#### Passo 6: Deploy
```bash
git push heroku main
# Ou se estiver em branch diferente:
# git push heroku seu-branch:main
```

#### Passo 7: Verificar Status
```bash
heroku logs --tail
# Ou acesse: https://seu-app-name.herokuapp.com/api/health
```

---

### Opção 2: GitHub Pages (Apenas Frontend)

#### Passo 1: Criar repositório
```bash
git clone https://github.com/seu-usuario/auto-electrical-moz.git
cd auto-electrical-moz
```

#### Passo 2: Criar branch gh-pages
```bash
git checkout -b gh-pages
git push origin gh-pages
```

#### Passo 3: Configurar Settings
1. Vá a https://github.com/seu-usuario/auto-electrical-moz/settings
2. Vá a "Pages"
3. Selecione branch "gh-pages"
4. Clique "Save"

#### Passo 4: Acessar Site
```
https://seu-usuario.github.io/auto-electrical-moz
```

---

### Opção 3: PythonAnywhere (Backend)

#### Passo 1: Criar Conta
1. Acesse https://www.pythonanywhere.com/
2. Clique em "Pricing & signup"
3. Escolha plano (Free ou Paid)
4. Crie conta

#### Passo 2: Upload de Código
```bash
# No console PythonAnywhere:
git clone https://github.com/seu-usuario/auto-electrical-moz.git
cd auto-electrical-moz/backend
pip install -r requirements.txt
```

#### Passo 3: Configurar Aplicação
1. Vá a "Web" no Dashboard
2. Clique em "Add a new web app"
3. Escolha Python 3.9
4. Configure WSGI
5. Aponte para seu app.py

#### Passo 4: Reload
1. Vá a "Web"
2. Clique em "Reload seu-usuario.pythonanywhere.com"

---

## Configuração Pós-Deploy

### 1. Atualizar URL da API

Em `script.js`, altere:
```javascript
const API_URL = 'http://seu-app-name.herokuapp.com/api';
// Para:
const API_URL = 'https://seu-app-name.herokuapp.com/api';
```

### 2. Ativar HTTPS

**Heroku:** Ativar automaticamente na seção "Settings"

**GitHub Pages:** Automático com certificado Let's Encrypt

**PythonAnywhere:** Planos pagos incluem HTTPS

### 3. Configurar Email

1. Gere "Senha de Aplicativo" do Gmail:
   - https://myaccount.google.com/apppasswords
   - Escolha "Mail" e "Windows Computer"
   - Copie a senha

2. Configure no Heroku:
   ```bash
   heroku config:set MAIL_PASSWORD=sua_senha_aqui
   ```

### 4. Configurar WhatsApp (Twilio)

1. Crie conta em https://www.twilio.com/
2. Obtenha Account SID e Auth Token
3. Configure no Heroku:
   ```bash
   heroku config:set TWILIO_ACCOUNT_SID=seu_sid
   heroku config:set TWILIO_AUTH_TOKEN=seu_token
   ```

### 5. Configurar Google Analytics

1. Acesse https://analytics.google.com/
2. Crie nova propriedade
3. Copie ID (G-XXXXXXXXXX)
4. Atualize em `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

### 6. Registrar no Google Search Console

1. Acesse https://search.google.com/search-console
2. Adicione sua propriedade
3. Escolha "Domain" ou "URL prefix"
4. Verifique propriedade
5. Envie sitemap

---

## Comandos Úteis

### Heroku
```bash
# Ver logs
heroku logs --tail

# Abrir console
heroku run bash

# Ver variáveis de ambiente
heroku config

# Deletar app
heroku apps:destroy seu-app-name

# Ver estatus
heroku status
```

### Git
```bash
# Ver commits
git log --oneline

# Ver branches
git branch -a

# Fazer push
git push origin main

# Fazer pull
git pull origin main
```

---

## ✅ Checklist Pós-Deploy

- [ ] API está online (`/api/health` retorna OK)
- [ ] Site abre no navegador
- [ ] Formulário envia dados
- [ ] Email de confirmação chega
- [ ] Links funcionam
- [ ] Modo escuro/claro funciona
- [ ] Responsividade OK
- [ ] Analytics está rastreando
- [ ] WhatsApp abre corretamente
- [ ] HTTPS está ativo
- [ ] Domínio customizado (opcional)

---

## 🆘 Troubleshooting

### Erro 503 no Heroku
```bash
heroku logs --tail
# Verifique:
# - Variáveis de ambiente
# - Syntax errors
# - Imports faltando
```

### API não conecta
- Verifique URL em `script.js`
- Certifique-se CORS está ativo
- Verifique firewall

### Email não envia
- Teste credenciais
- Verifique "Senhas de Aplicativo"
- Verifique logs

### Banco de dados não conecta
- Heroku: Use PostgreSQL
- Comando: `heroku addons:create heroku-postgresql:hobby-dev`
- Atualize DATABASE_URL

---

## 📞 Suporte

- Documentação Heroku: https://devcenter.heroku.com/
- GitHub Pages: https://docs.github.com/en/pages
- PythonAnywhere: https://help.pythonanywhere.com/

---

**Parabéns! Seu site está no ar! 🎉**
