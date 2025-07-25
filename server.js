const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do banco de dados
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'achados_perdidos'
});

// Verificação inicial de conexão com o banco
db.getConnection()
  .then(connection => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

// Configuração de e-mail
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Rota padrão
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para registrar usuário
app.post('/api/registrar-usuario', async (req, res) => {
  const { nome, sobrenome, email, registro, senha, confirmar_senha, termos } = req.body;

  console.log('Dados recebidos:', { nome, sobrenome, email, registro, senha, confirmar_senha, termos }); // Log para debug

  // Validações
  if (!nome || !sobrenome || !email || !registro || !senha || !confirmar_senha || typeof termos === 'undefined') {
    return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
  }
  if (nome.length < 2) {
    return res.status(400).json({ success: false, message: 'O nome deve ter pelo menos 2 caracteres.' });
  }
  if (sobrenome.length < 2) {
    return res.status(400).json({ success: false, message: 'O sobrenome deve ter pelo menos 2 caracteres.' });
  }
  if (!/^[a-zA-Z0-9._%+-]+@senaimgaluno\.com\.br$/.test(email)) {
    return res.status(400).json({ success: false, message: 'E-mail institucional inválido. Use o domínio @senaimgaluno.com.br.' });
  }
  if (!/^\d{6,10}$/.test(registro)) {
    return res.status(400).json({ success: false, message: 'O registro acadêmico deve ter entre 6 e 10 dígitos.' });
  }
  if (senha !== confirmar_senha) {
    return res.status(400).json({ success: false, message: 'As senhas não coincidem.' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ success: false, message: 'A senha deve ter pelo menos 6 caracteres.' });
  }
  if (!termos) {
    return res.status(400).json({ success: false, message: 'Você deve aceitar os Termos de Uso e a Política de Privacidade.' });
  }

  try {
    // Verificar duplicatas
    const [existingUsers] = await db.query('SELECT * FROM usuarios WHERE registro = ? OR email = ?', [registro, email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Registro ou e-mail já cadastrado.' });
    }

    // Criptografar senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // Inserir no banco
    await db.query(
      'INSERT INTO usuarios (nome, sobrenome, email, registro, senha, termos_aceitos) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, sobrenome, email, registro, hashedPassword, true]
    );

    res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error(`Erro ao cadastrar usuário em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}:`, error);
    res.status(500).json({ success: false, message: 'Erro ao processar o cadastro. Tente novamente.' });
  }
});

// Rota para login
app.post('/api/login', async (req, res) => {
  const { registro, senha } = req.body;

  // Validações
  if (!registro || !/^\d{6,10}$/.test(registro)) {
    return res.status(400).json({ success: false, message: 'Registro acadêmico inválido (mínimo 6 dígitos).' });
  }
  if (!senha || senha.length < 6) {
    return res.status(400).json({ success: false, message: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    // Buscar usuário no banco
    const [users] = await db.query('SELECT * FROM usuarios WHERE registro = ?', [registro]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro não encontrado.' });
    }

    const user = users[0];
    // Comparar senha com hash
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Senha incorreta.' });
    }

    // Login bem-sucedido
    console.log(`Login bem-sucedido para registro ${registro} em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.`);
    res.status(200).json({ success: true, message: 'Login bem-sucedido! Redirecionando...', redirect: '/index.html' });
  } catch (error) {
    console.error(`Erro ao autenticar em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}:`, error);
    res.status(500).json({ success: false, message: 'Erro ao autenticar. Tente novamente.' });
  }
});

// Rota para registro de item perdido
app.post('/api/registrar-perdido', (req, res) => {
  const { nome_item, descricao, local, data, cor, marca, caracteristica_unica } = req.body;
  if (!nome_item || !descricao || !local || !data) {
    return res.status(400).json({ success: false, message: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }
  console.log(`Item perdido registrado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}:`, { nome_item, descricao, local, data, cor, marca, caracteristica_unica });
  res.status(200).json({ success: true, message: 'Item perdido registrado com sucesso!' });
});

// Rota para registro de item encontrado
app.post('/api/registrar-encontrado', (req, res) => {
  const { nome_item, descricao, local, data } = req.body;
  if (!nome_item || !descricao || !local || !data) {
    return res.status(400).json({ success: false, message: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }
  console.log(`Item encontrado registrado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}:`, { nome_item, descricao, local, data });
  res.status(200).json({ success: true, message: 'Item encontrado registrado com sucesso!' });
});

// Rota para iniciar redefinição de senha
app.post('/api/forgot-password', (req, res) => {
  const { registro } = req.body;
  const user = users.find(u => u.registro === registro); // Substituir por consulta ao MySQL
  if (!user) {
    return res.status(404).json({ success: false, message: 'Registro não encontrado.' });
  }

  const token = crypto.randomBytes(20).toString('hex');
  const expires = Date.now() + 3600000; // 1 hora de validade
  resetTokens.set(token, { userId: user.id, expires });

  const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Redefinição de Senha - Achados e Perdidos SENAI',
    text: `Clique no link para redefinir sua senha: ${resetLink}\nO link expira em 1 hora. Enviado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.`
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error('Erro ao enviar e-mail:', error);
      return res.status(500).json({ success: false, message: 'Erro ao enviar e-mail.' });
    }
    console.log(`E-mail de redefinição enviado para ${user.email} em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.`);
    res.status(200).json({ success: true, message: 'E-mail de redefinição enviado!' });
  });
});

// Rota para redefinir senha
app.post('/api/reset-password', (req, res) => {
  const { token, nova_senha } = req.body;
  const tokenData = resetTokens.get(token);

  if (!tokenData || tokenData.expires < Date.now()) {
    return res.status(400).json({ success: false, message: 'Token inválido ou expirado.' });
  }

  const user = users.find(u => u.id === tokenData.userId); // Substituir por consulta ao MySQL
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
  }

  // Atualizar senha (simulação; use bcrypt em produção)
  user.senha = nova_senha; // Substitua por hash (ex.: bcrypt.hashSync(nova_senha, 10))
  resetTokens.delete(token);
  console.log(`Senha redefinida para usuário ${user.registro} em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.`);

  res.status(200).json({ success: true, message: 'Senha redefinida com sucesso!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT} em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.`);
});