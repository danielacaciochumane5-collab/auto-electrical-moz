// ===== SMOOTH SCROLL PARA LINKS ÂNCORA =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== DARK MODE / LIGHT MODE =====
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const body = document.body;

// Verificar preferência do utilizador no localStorage
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
  body.classList.add('light-mode');
  updateThemeIcon();
}

// Alternar modo quando clica no botão
themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  
  const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
  
  updateThemeIcon();
});

// Atualizar ícone do tema
function updateThemeIcon() {
  const icon = themeToggle.querySelector('i');
  if (body.classList.contains('light-mode')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

// ===== CONFIGURAÇÃO DA API =====
const API_URL = 'http://localhost:5000/api'; // Mudar para URL de produção

// ===== FORMULÁRIO DE CONTACTO =====
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Pegar nos dados do formulário
    const nome = this.querySelector('input[name="nome"]').value;
    const email = this.querySelector('input[name="email"]').value;
    const telefone = this.querySelector('input[name="telefone"]').value;
    const mensagem = this.querySelector('textarea[name="mensagem"]').value;
    
    // Validação básica
    if (!nome || !email || !telefone || !mensagem) {
      mostrarErro('❌ Por favor, preencha todos os campos!');
      return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarErro('❌ Por favor, insira um email válido!');
      return;
    }
    
    // Validar telefone (apenas números)
    const telefoneLimpo = telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 9) {
      mostrarErro('❌ Por favor, insira um telefone válido!');
      return;
    }
    
    // Enviar para API
    await enviarContacto({
      nome,
      email,
      telefone,
      mensagem
    });
  });
}

// Função para enviar contacto à API
async function enviarContacto(dados) {
  try {
    mostrarCarregamento('📤 Enviando mensagem...');
    
    const response = await fetch(`${API_URL}/contactos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados)
    });
    
    const resultado = await response.json();
    
    if (response.ok) {
      // Sucesso - Enviar para WhatsApp também
      mostrarSucesso('✅ Mensagem recebida! Redirecionando para WhatsApp...');
      
      // Abrir WhatsApp
      const mensagemWhatsApp = `Olá AUTO ELECTRICAL MOZ, meu nome é ${dados.nome}. Meu email é ${dados.email} e telefone ${dados.telefone}. Minha mensagem: ${dados.mensagem}`;
      const urlWhatsApp = `https://wa.me/258865860414?text=${encodeURIComponent(mensagemWhatsApp)}`;
      window.open(urlWhatsApp, '_blank');
      
      // Limpar formulário
      setTimeout(() => {
        contactForm.reset();
        formNote.textContent = '';
        
        // Rastrear evento
        rastrearEvento('contacto_enviado', {
          nome: dados.nome,
          email: dados.email
        });
      }, 1000);
    } else {
      mostrarErro(`❌ ${resultado.erro || 'Erro ao enviar mensagem'}`);
    }
  } catch (erro) {
    mostrarErro(`❌ Erro de conexão: ${erro.message}`);
  }
}

// Função auxiliar para mostrar erro
function mostrarErro(mensagem) {
  formNote.style.color = '#ff6b00';
  formNote.textContent = mensagem;
  
  // Analytics
  rastrearEvento('erro_formulario', {
    mensagem: mensagem
  });
}

// Função auxiliar para mostrar sucesso
function mostrarSucesso(mensagem) {
  formNote.style.color = '#4CAF50';
  formNote.textContent = mensagem;
}

// Função auxiliar para mostrar carregamento
function mostrarCarregamento(mensagem) {
  formNote.style.color = '#ff6b00';
  formNote.textContent = mensagem;
}

// ===== ANALYTICS - RASTREAMENTO DE EVENTOS =====

// Função para rastrear eventos customizados
function rastrearEvento(nomeEvento, dados = {}) {
  try {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', nomeEvento, dados);
    }
    
    // Console para debug
    console.log(`📊 Evento rastreado: ${nomeEvento}`, dados);
  } catch (erro) {
    console.error('Erro ao rastrear evento:', erro);
  }
}

// Rastrear tempo na página
let tempoInicial = Date.now();

window.addEventListener('beforeunload', () => {
  const tempoTotal = Math.round((Date.now() - tempoInicial) / 1000); // em segundos
  rastrearEvento('tempo_pagina', {
    duracao: tempoTotal,
    pagina: window.location.pathname
  });
});

// Rastrear cliques em botões importantes
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn')) {
    const tipo = e.target.classList.contains('primary') ? 'primario' : 'secundario';
    const texto = e.target.textContent.trim();
    
    rastrearEvento('clique_botao', {
      tipo: tipo,
      texto: texto,
      pagina: window.location.pathname
    });
  }
});

// Rastrear cliques em links do menu
document.querySelectorAll('.nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    rastrearEvento('clique_menu', {
      secao: link.getAttribute('href'),
      texto: link.textContent.trim()
    });
  });
});

// Rastrear scroll
let ultimoScroll = 0;
window.addEventListener('scroll', () => {
  const scrollAtual = window.scrollY;
  
  // Rastrear quando atinge 25%, 50%, 75% da página
  const altoPagina = document.documentElement.scrollHeight - window.innerHeight;
  const porcentagemScroll = (scrollAtual / altoPagina) * 100;
  
  if (porcentagemScroll > 25 && ultimoScroll <= 25) {
    rastrearEvento('scroll_25', { pagina: window.location.pathname });
  }
  if (porcentagemScroll > 50 && ultimoScroll <= 50) {
    rastrearEvento('scroll_50', { pagina: window.location.pathname });
  }
  if (porcentagemScroll > 75 && ultimoScroll <= 75) {
    rastrearEvento('scroll_75', { pagina: window.location.pathname });
  }
  
  ultimoScroll = porcentagemScroll;
});

// Rastrear visualizações de seção
const observerSecoes = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const seccaoId = entry.target.id;
      rastrearEvento('secao_visualizada', {
        secao: seccaoId || 'desconhecida'
      });
    }
  });
});

document.querySelectorAll('.section').forEach(secao => {
  observerSecoes.observe(secao);
});

// ===== EFEITO DE ANIMAÇÃO AO SCROLL =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observar cards de serviços, blog e avaliações
document.querySelectorAll('.grid article, .blog-card, .testimonial, .gallery-item, .contact-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

// ===== CARREGAR GALERIA DA API (FUTURO) =====
async function carregarGaleria() {
  try {
    const response = await fetch(`${API_URL}/galeria`);
    const dados = await response.json();
    
    if (response.ok && dados.fotos.length > 0) {
      console.log('📸 Galeria carregada:', dados.fotos);
      // Aqui pode-se adicionar lógica para mostrar fotos reais
    }
  } catch (erro) {
    console.error('Erro ao carregar galeria:', erro);
  }
}

// ===== CARREGAR BLOG DA API (FUTURO) =====
async function carregarBlog() {
  try {
    const response = await fetch(`${API_URL}/blog`);
    const dados = await response.json();
    
    if (response.ok) {
      console.log('📝 Blog carregado:', dados.artigos);
      // Aqui pode-se adicionar lógica para mostrar artigos dinâmicos
    }
  } catch (erro) {
    console.error('Erro ao carregar blog:', erro);
  }
}

// ===== CARREGAR ANALYTICS =====
async function carregarAnalytics() {
  try {
    const response = await fetch(`${API_URL}/analytics/resumo`);
    const dados = await response.json();
    
    if (response.ok) {
      console.log('📊 Analytics:', dados);
      // Dados disponíveis para dashboard futuro
    }
  } catch (erro) {
    console.error('Erro ao carregar analytics:', erro);
  }
}

// ===== INICIALIZAR AO CARREGAR A PÁGINA =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ AUTO ELECTRICAL MOZ - Script carregado com sucesso! 🚗⚡');
  
  // Carregar dados
  carregarGaleria();
  carregarBlog();
  carregarAnalytics();
  
  // Rastrear carregamento da página
  rastrearEvento('pagina_carregada', {
    pagina: window.location.pathname,
    hora: new Date().toISOString()
  });
});

// ===== TRATAMENTO DE ERROS GLOBAL =====
window.addEventListener('error', (evento) => {
  console.error('❌ Erro:', evento.error);
  rastrearEvento('erro_javascript', {
    mensagem: evento.error.message,
    stack: evento.error.stack
  });
});
