require('dotenv').config();

const express = require('express');
const cors = require('cors');
const conn = require('./db/conn');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Log = require('./models/log');
const Movie = require('./models/movie');

const app = express();
// Config JSON response
app.use(express.json());

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Public folder for images
app.use(express.static('public'));

// Função para criar o primeiro administrador se não existir
const createFirstAdmin = async () => {
  try {
    const adminExists = await User.findOne({ where: { isAdmin: true } });

    if (!adminExists) {
      const hashedPassword = bcrypt.hashSync(process.env.FIRST_PASSWORD, 10);
      await User.create({
        name: process.env.FIRST_NAME,
        email: process.env.FIRST_EMAIL,
        password: hashedPassword,
        isAdmin: true,
        bit: true,
      });
      console.log('Primeiro administrador criado com sucesso');
    } else {
      console.log('O administrador já existe');
    }
  } catch (error) {
    console.error('Erro ao criar o primeiro administrador:', error);
  }
};

// Routes
const UserRoutes = require('./routes/UserRoutes');
const MovieRoutes = require('./routes/MovieRoutes');

app.use('/users', UserRoutes);
app.use('/movie', MovieRoutes);


conn
  .sync()
  //.sync({ force: true })
  .then(async () => {
    // Função para criar o primeiro administrador se não existir
    await createFirstAdmin();

    app.listen(5000, () => {
      console.log('O servidor está rodando na porta 5000');
    });
  })
  .catch((err) => console.log(err));
