const User = require('../models/user');

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers 
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')

module.exports = class UserController {
  static async registerAdmin(req, res) {
    const { name, email, password, confirmPassword } = req.body;
    console.log("aqui")

    // validations

    const errorMessages = {
      name: 'O nome é obrigatório',
      email: 'O email é obrigatório',
      password: 'A senha é obrigatória',
      confirmPassword: 'A confirmação de senha é obrigatória',
      passwordMatch: 'A senha e a confirmação de senha não são iguais!',
    };

    const sendErrorResponse = (message) => {
      res.status(422).json({ message });
    };

    const validations = {
      name,
      email,
      password,
      confirmPassword,
    };

    for (const field in validations) {
      if (!validations[field]) {
        sendErrorResponse(errorMessages[field]);
        return;
      }
    }

    if (password.length < 6) {
      sendErrorResponse('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      sendErrorResponse(errorMessages.passwordMatch);
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ where: { email: email } });
    console.log(userExists)

    if (userExists) {
      res.status(422).json({
        message: 'Por favor, utilize outro e-mail',
      });
      return;
    }

    const isAdmin = true;

    // create a password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)


    try {
      const user = await User.create({ name, email, password: passwordHash, isAdmin });
      await createUserToken(user, req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body

    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório' })
      return
    }

    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória' })
      return
    }

    // check if user exists
    const user = await User.findOne({ where: { email: email } })

    if (!user) {
      res.status(422).json({
        message: 'Não há usuário cadastrado com este e-mail!',
      })
      return
    }

    // Check if password match with db password
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
      res.status(422).json({
        message: 'Senha inválida!',
      })
      return
    }

    await createUserToken(user, req, res)  //login
  }

  static async checkUser(req, res) {
    let currentUser


    if (req.headers.authorization) {
      const token = getToken(req)
      try {
        const decoded = jwt.verify(token, process.env.SECRET);

        currentUser = await User.findByPk(decoded.id);

        if (currentUser) {
          currentUser.password = undefined;
        }
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        currentUser = null;
      }
    } else {
      currentUser = null
    }

    res.status(200).send(currentUser)
  }

  static async getUserById(req, res) {
    const id = req.params.id

    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        res.status(422).json({
          message: 'Usuário não encontrado!',
        });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
      });
    }
  }








};
