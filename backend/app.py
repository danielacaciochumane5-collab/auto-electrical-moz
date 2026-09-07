from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime
import re
from dotenv import load_dotenv
import requests

# Carregar variáveis de ambiente
load_dotenv()

# Inicializar Flask
app = Flask(__name__)

# Configuração
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///autoelectrical.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', True)
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'contacto@autoelectricalmoz.com')

# CORS
CORS(app)

# Database
db = SQLAlchemy(app)

# Mail
mail = Mail(app)

# ===== MODELOS DE BASE DE DADOS =====

class Contact(db.Model):
    """Modelo para armazenar contactos de clientes"""
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    mensagem = db.Column(db.Text, nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    email_verificado = db.Column(db.Boolean, default=False)
    ip_address = db.Column(db.String(45))
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'telefone': self.telefone,
            'mensagem': self.mensagem,
            'data_criacao': self.data_criacao.isoformat(),
            'email_verificado': self.email_verificado
        }

class Galeria(db.Model):
    """Modelo para fotos da galeria"""
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(120), nullable=False)
    descricao = db.Column(db.Text)
    url_imagem = db.Column(db.String(255), nullable=False)
    data_upload = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'url_imagem': self.url_imagem,
            'data_upload': self.data_upload.isoformat()
        }

class BlogArtigo(db.Model):
    """Modelo para artigos do blog"""
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    conteudo = db.Column(db.Text, nullable=False)
    resumo = db.Column(db.String(500))
    autor = db.Column(db.String(120), default='AUTO ELECTRICAL MOZ')
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    ativo = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'conteudo': self.conteudo,
            'resumo': self.resumo,
            'autor': self.autor,
            'data_criacao': self.data_criacao.isoformat(),
            'data_atualizacao': self.data_atualizacao.isoformat()
        }

class EmailVerificacao(db.Model):
    """Modelo para tokens de verificação de email"""
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    token = db.Column(db.String(100), unique=True, nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    verificado = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'verificado': self.verificado
        }

# ===== VALIDAÇÕES =====

def validar_email(email):
    """Validar formato de email"""
    regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(regex, email) is not None

def validar_telefone(telefone):
    """Validar telefone (apenas números)"""
    telefone_limpo = re.sub(r'\D', '', telefone)
    return len(telefone_limpo) >= 9

# ===== ROTAS API =====

@app.route('/api/health', methods=['GET'])
def health():
    """Verificar saúde da API"""
    return jsonify({'status': 'ok', 'message': 'AUTO ELECTRICAL MOZ API está online!'}), 200

# ===== ROTAS DE CONTACTOS =====

@app.route('/api/contactos', methods=['POST'])
def criar_contacto():
    """Criar novo contacto"""
    try:
        dados = request.get_json()
        
        # Validação
        if not dados.get('nome') or not dados.get('email') or not dados.get('telefone') or not dados.get('mensagem'):
            return jsonify({'erro': 'Todos os campos são obrigatórios'}), 400
        
        if not validar_email(dados['email']):
            return jsonify({'erro': 'Email inválido'}), 400
        
        if not validar_telefone(dados['telefone']):
            return jsonify({'erro': 'Telefone inválido'}), 400
        
        # Verificar se email já existe
        email_existente = Contact.query.filter_by(email=dados['email']).first()
        if email_existente:
            return jsonify({'erro': 'Este email já foi utilizado'}), 400
        
        # Criar contacto
        contacto = Contact(
            nome=dados['nome'],
            email=dados['email'],
            telefone=dados['telefone'],
            mensagem=dados['mensagem'],
            ip_address=request.remote_addr
        )
        
        db.session.add(contacto)
        db.session.commit()
        
        # Enviar email de confirmação
        enviar_email_confirmacao(dados['email'], dados['nome'])
        
        # Enviar mensagem para WhatsApp (opcional)
        enviar_whatsapp(dados)
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Contacto recebido com sucesso!',
            'contacto': contacto.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@app.route('/api/contactos', methods=['GET'])
def listar_contactos():
    """Listar todos os contactos (apenas para admin)"""
    try:
        # Aqui pode adicionar autenticação se necessário
        contactos = Contact.query.order_by(Contact.data_criacao.desc()).all()
        return jsonify({
            'contactos': [c.to_dict() for c in contactos],
            'total': len(contactos)
        }), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/api/contactos/<int:id>', methods=['GET'])
def obter_contacto(id):
    """Obter um contacto específico"""
    try:
        contacto = Contact.query.get(id)
        if not contacto:
            return jsonify({'erro': 'Contacto não encontrado'}), 404
        return jsonify(contacto.to_dict()), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

# ===== ROTAS DE EMAIL =====

def enviar_email_confirmacao(email, nome):
    """Enviar email de confirmação"""
    try:
        msg = Message(
            subject='Confirmação de Contacto - AUTO ELECTRICAL MOZ',
            recipients=[email],
            html=f"""
            <h2>Obrigado, {nome}!</h2>
            <p>Recebemos seu contacto e em breve retornaremos.</p>
            <p>Se preferir, pode nos contactar por:</p>
            <ul>
                <li>WhatsApp: <a href="https://wa.me/258865860414">+258 865 860 414</a></li>
                <li>Telefone: +258 865 860 414 ou +258 834 879 998</li>
            </ul>
            <p><strong>AUTO ELECTRICAL MOZ</strong></p>
            <p>Diagnóstico preciso. Soluções confiáveis.</p>
            """
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Erro ao enviar email: {e}")
        return False

@app.route('/api/verificar-email/<token>', methods=['GET'])
def verificar_email(token):
    """Verificar email via token"""
    try:
        verificacao = EmailVerificacao.query.filter_by(token=token).first()
        
        if not verificacao:
            return jsonify({'erro': 'Token inválido'}), 400
        
        if verificacao.verificado:
            return jsonify({'mensagem': 'Email já foi verificado'}), 200
        
        # Atualizar status
        verificacao.verificado = True
        
        # Atualizar contacto
        contacto = Contact.query.filter_by(email=verificacao.email).first()
        if contacto:
            contacto.email_verificado = True
        
        db.session.commit()
        
        return jsonify({'sucesso': True, 'mensagem': 'Email verificado com sucesso!'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

# ===== ROTAS DE WHATSAPP =====

def enviar_whatsapp(dados):
    """Enviar mensagem via WhatsApp Business API (opcional)"""
    try:
        # Este é um exemplo - necessita de configuração real com WhatsApp Business API
        mensagem = f"""
        Novo contacto recebido!
        Nome: {dados.get('nome')}
        Email: {dados.get('email')}
        Telefone: {dados.get('telefone')}
        Mensagem: {dados.get('mensagem')}
        """
        
        # Aqui você colocaria a integração real com WhatsApp Business API
        # Por exemplo, usando a biblioteca twilio
        
        print(f"WhatsApp enviado para: {mensagem}")
        return True
    except Exception as e:
        print(f"Erro ao enviar WhatsApp: {e}")
        return False

# ===== ROTAS DE GALERIA =====

@app.route('/api/galeria', methods=['GET'])
def listar_galeria():
    """Listar fotos da galeria"""
    try:
        fotos = Galeria.query.order_by(Galeria.data_upload.desc()).all()
        return jsonify({
            'fotos': [f.to_dict() for f in fotos],
            'total': len(fotos)
        }), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/api/galeria', methods=['POST'])
def criar_galeria():
    """Criar novo item na galeria (upload de foto)"""
    try:
        dados = request.get_json()
        
        if not dados.get('titulo') or not dados.get('url_imagem'):
            return jsonify({'erro': 'Titulo e URL da imagem são obrigatórios'}), 400
        
        foto = Galeria(
            titulo=dados['titulo'],
            descricao=dados.get('descricao', ''),
            url_imagem=dados['url_imagem']
        )
        
        db.session.add(foto)
        db.session.commit()
        
        return jsonify({
            'sucesso': True,
            'foto': foto.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

# ===== ROTAS DE BLOG =====

@app.route('/api/blog', methods=['GET'])
def listar_blog():
    """Listar artigos do blog"""
    try:
        artigos = BlogArtigo.query.filter_by(ativo=True).order_by(BlogArtigo.data_criacao.desc()).all()
        return jsonify({
            'artigos': [a.to_dict() for a in artigos],
            'total': len(artigos)
        }), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/api/blog/<int:id>', methods=['GET'])
def obter_artigo(id):
    """Obter um artigo específico"""
    try:
        artigo = BlogArtigo.query.get(id)
        if not artigo or not artigo.ativo:
            return jsonify({'erro': 'Artigo não encontrado'}), 404
        return jsonify(artigo.to_dict()), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/api/blog', methods=['POST'])
def criar_artigo():
    """Criar novo artigo no blog"""
    try:
        dados = request.get_json()
        
        if not dados.get('titulo') or not dados.get('conteudo'):
            return jsonify({'erro': 'Titulo e conteúdo são obrigatórios'}), 400
        
        artigo = BlogArtigo(
            titulo=dados['titulo'],
            conteudo=dados['conteudo'],
            resumo=dados.get('resumo', ''),
            autor=dados.get('autor', 'AUTO ELECTRICAL MOZ')
        )
        
        db.session.add(artigo)
        db.session.commit()
        
        return jsonify({
            'sucesso': True,
            'artigo': artigo.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

# ===== ANALYTICS =====

@app.route('/api/analytics/resumo', methods=['GET'])
def analytics_resumo():
    """Obter resumo de analytics"""
    try:
        total_contactos = Contact.query.count()
        emails_verificados = Contact.query.filter_by(email_verificado=True).count()
        total_artigos = BlogArtigo.query.filter_by(ativo=True).count()
        total_fotos = Galeria.query.count()
        
        return jsonify({
            'total_contactos': total_contactos,
            'emails_verificados': emails_verificados,
            'total_artigos': total_artigos,
            'total_fotos': total_fotos,
            'taxa_verificacao': (emails_verificados / total_contactos * 100) if total_contactos > 0 else 0
        }), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

# ===== CRIAR TABELAS =====

@app.route('/api/init-db', methods=['POST'])
def init_db():
    """Inicializar base de dados (usar apenas uma vez)"""
    try:
        db.create_all()
        return jsonify({'mensagem': 'Base de dados inicializada com sucesso!'}), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

# ===== ERROR HANDLERS =====

@app.errorhandler(404)
def not_found(error):
    return jsonify({'erro': 'Recurso não encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'erro': 'Erro interno do servidor'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
