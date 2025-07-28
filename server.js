const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');
const session = require('express-session');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use((req, res, next) => {
  console.log(`Requisição para: ${req.url} às ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuração de sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'sua-chave-secreta-super-segura',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const nomeItem = req.body.nome_item ? req.body.nome_item.replace(/[^a-zA-Z0-9]/g, '_') : 'item';
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `${nomeItem}_${timestamp}${extension}`);
  }
});
const upload = multer({ storage: storage });

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
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Rota padrão
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para redirecionar o link de redefinição
app.get('/reset-password', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send('Token inválido.');
  }
  res.sendFile(path.join(__dirname, 'public', 'redefinir_senha.html'));
});

// Rota para registrar usuário
app.post('/api/registrar-usuario', async (req, res) => {
  const { nome, sobrenome, email, registro, senha, confirmar_senha, termos } = req.body;

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
    const [existingUsers] = await db.query('SELECT * FROM usuarios WHERE registro = ? OR email = ?', [registro, email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Registro ou e-mail já cadastrado.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

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

// Rota para login com logs de depuração
app.post('/api/login', async (req, res) => {
  const { registro, senha } = req.body;
  console.log(`Tentativa de login - Registro: ${registro}, Senha: [HIDDEN]`);

  if (!registro || !/^\d{6,10}$/.test(registro)) {
    console.log(`Validação falhou: Registro inválido (${registro})`);
    return res.status(400).json({ success: false, message: 'Registro acadêmico inválido (6 a 10 dígitos).' });
  }
  if (!senha || senha.length < 6) {
    console.log(`Validação falhou: Senha inválida (tamanho: ${senha.length})`);
    return res.status(400).json({ success: false, message: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    const [users] = await db.query('SELECT * FROM usuarios WHERE registro = ?', [registro]);
    console.log(`Usuários encontrados: ${users.length}`);
    if (users.length === 0) {
      console.log(`Registro ${registro} não encontrado no banco de dados`);
      return res.status(404).json({ success: false, message: 'Registro não encontrado.' });
    }

    const user = users[0];
    const match = await bcrypt.compare(senha, user.senha);
    console.log(`Comparação de senha para registro ${registro}: ${match}`);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Senha incorreta.' });
    }

    req.session.user = {
      id: user.id,
      registro: user.registro,
      nome: user.nome,
      email: user.email
    };

    console.log(`Login bem-sucedido para registro ${registro} em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
    res.status(200).json({ success: true, message: 'Login bem-sucedido! Redirecionando...', redirect: '/index.html' });
  } catch (error) {
    console.error(`Erro ao autenticar em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}:`, error);
    res.status(500).json({ success: false, message: 'Erro ao autenticar. Tente novamente.' });
  }
});

// Rota para verificar se o usuário está autenticado
app.get('/api/check-auth', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ success: true, user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: 'Não autenticado.' });
  }
});

// Rota para logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(`Erro ao fazer logout em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}:`, err);
      return res.status(500).json({ success: false, message: 'Erro ao fazer logout.' });
    }
    res.status(200).json({ success: true, message: 'Logout realizado com sucesso!' });
  });
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
app.post('/api/registrar-encontrado', upload.single('foto'), async (req, res) => {
  const { nome_item, descricao, local, data } = req.body;
  const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!nome_item || !descricao || !local || !data) {
    return res.status(400).json({ success: false, message: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO itens_encontrados (nome_item, descricao, local_encontrado, data_encontrada, foto_path) VALUES (?, ?, ?, ?, ?)',
      [nome_item, descricao, local, data, fotoPath]
    );

    console.log(`Item encontrado registrado com ID ${result.insertId} em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}:`, { nome_item, descricao, local, data, fotoPath });
    res.status(200).json({ success: true, message: 'Item encontrado registrado com sucesso!' });
  } catch (error) {
    console.error(`Erro ao registrar item encontrado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}:`, error);
    res.status(500).json({ success: false, message: 'Erro ao registrar item. Tente novamente.' });
  }
});

// Rota para buscar todos os itens encontrados
app.get('/api/itens-encontrados', async (req, res) => {
  try {
    console.log('Tentando buscar itens da tabela itens_encontrados...');
    const [rows] = await db.query('SELECT * FROM itens_encontrados');
    console.log('Itens encontrados:', rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error(`Erro ao buscar itens em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}:`, error);
    res.status(500).json({ success: false, message: 'Erro ao buscar itens.' });
  }
});

// Rota para iniciar redefinição de senha
app.post('/api/forgot-password', async (req, res) => {
  const { registro } = req.body;

  if (!registro || !/^\d{6,10}$/.test(registro)) {
    return res.status(400).json({ success: false, message: 'Registro acadêmico inválido (6 a 10 dígitos).' });
  }

  try {
    const [users] = await db.query('SELECT * FROM usuarios WHERE registro = ?', [registro]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro não encontrado.' });
    }

    const user = users[0];
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    await db.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expires]
    );

    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Redefinição de Senha - Achados e Perdidos SENAI',
      text: `Clique no link para redefinir sua senha: ${resetLink}\nO link expira em 1 hora. Enviado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.`
    };

    await transporter.sendMail(mailOptions);
    console.log(`E-mail de redefinição enviado para ${user.email} em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.`);
    res.status(200).json({ success: true, message: 'E-mail de redefinição enviado! Redirecionando em 3 segundos...' });
  } catch (error) {
    console.error(`Erro ao processar redefinição em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}:`, error);
    res.status(500).json({ success: false, message: 'Erro ao enviar e-mail. Tente novamente.' });
  }
});

// Rota para redefinir senha
app.post('/api/reset-password', async (req, res) => {
  const { token, nova_senha } = req.body;

  if (!token || !nova_senha || nova_senha.length < 6) {
    return res.status(400).json({ success: false, message: 'Token ou senha inválida.' });
  }

  try {
    const [tokens] = await db.query('SELECT * FROM password_resets WHERE token = ? AND expires_at > ?', [token, new Date()]);
    if (tokens.length === 0) {
      return res.status(400).json({ success: false, message: 'Token inválido ou expirado.' });
    }

    const tokenData = tokens[0];
    const [users] = await db.query('SELECT * FROM usuarios WHERE id = ?', [tokenData.user_id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    const user = users[0];
    const hashedPassword = await bcrypt.hash(nova_senha, 10);

    await db.query('UPDATE usuarios SET senha = ? WHERE id = ?', [hashedPassword, user.id]);
    await db.query('DELETE FROM password_resets WHERE token = ?', [token]);

    console.log(`Senha redefinida para usuário ${user.registro} em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.`);
    res.status(200).json({ success: true, message: 'Senha redefinida com sucesso! Redirecionando...' });
  } catch (error) {
    console.error(`Erro ao redefinir senha em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}:`, error);
    res.status(500).json({ success: false, message: 'Erro ao redefinir senha. Tente novamente.' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT} em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.`);
});