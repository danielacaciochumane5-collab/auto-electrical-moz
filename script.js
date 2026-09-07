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

// ===== FORMULÁRIO DE CONTACTO =====
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Pegar nos dados do formulário
    const formData = new FormData(contactForm);
    const nome = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const telefone = this.querySelector('input[type="tel"]').value;
    const mensagem = this.querySelector('textarea').value;
    
    // Validação básica
    if (!nome || !email || !telefone || !mensagem) {
      formNote.style.color = '#ff6b00';
      formNote.textContent = '❌ Por favor, preencha todos os campos!';
      return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formNote.style.color = '#ff6b00';
      formNote.textContent = '❌ Por favor, insira um email válido!';
      return;
    }
    
    // Validar telefone (apenas números)
    const telefoneLimpo = telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 9) {
      formNote.style.color = '#ff6b00';
      formNote.textContent = '❌ Por favor, insira um telefone válido!';
      return;
    }
    
    // Simular envio (em produção, isto seria enviado para um servidor)
    formNote.style.color = '#ff6b00';
    formNote.textContent = '📤 Enviando mensagem...';
    
    // Simular delay de envio
    setTimeout(() => {
      // Criar mensagem para WhatsApp
      const mensagemWhatsApp = `Olá AUTO ELECTRICAL MOZ, meu nome é ${nome}. Meu email é ${email} e telefone ${telefone}. Minha mensagem: ${mensagem}`;
      const urlWhatsApp = `https://wa.me/258865860414?text=${encodeURIComponent(mensagemWhatsApp)}`;
      
      formNote.style.color = '#4CAF50';
      formNote.textContent = '✅ Mensagem preparada! Abrindo WhatsApp...';
      
      // Abrir WhatsApp
      window.open(urlWhatsApp, '_blank');
      
      // Limpar formulário
      setTimeout(() => {
        contactForm.reset();
        formNote.textContent = '';
      }, 1000);
    }, 500);
  });
}

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

// ===== CARROSSEL DE GALERIA (OPCIONAL - futuro) =====
let currentGalleryIndex = 0;
const galleryItems = document.querySelectorAll('.gallery-item');

function rotateGallery() {
  if (galleryItems.length > 0) {
    // Aqui pode-se adicionar lógica de carrossel no futuro
    // Por enquanto, apenas mostramos todos os itens em grid
  }
}

// ===== NAVEGAÇÃO RESPONSIVA MOBILE =====
// Fechar navegação ao clicar num link (se houver menu hamburguer no futuro)
document.querySelectorAll('.nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    // Aqui pode fechar o menu mobile se houver hamburguer
  });
});

// ===== VALIDAÇÃO E FEEDBACK EM TEMPO REAL =====
const emailInput = document.querySelector('input[type="email"]');
if (emailInput) {
  emailInput.addEventListener('blur', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !emailRegex.test(this.value)) {
      this.style.borderColor = '#ff6b00';
    } else {
      this.style.borderColor = '';
    }
  });
}

console.log('AUTO ELECTRICAL MOZ - Script carregado com sucesso! 🚗⚡');
