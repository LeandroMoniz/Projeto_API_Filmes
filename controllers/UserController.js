//models
const User = require('../models/user');
const Log = require('../models/log');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//helpers 
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const sendErrorResponse = require('../helpers/sendErrorResponse');
//errorMessages
const errorMessages = require('../public/errorMessages/errorMessages');
module.exports = class UserController {
  static async registerAdmin(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    // validations

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (user.isAdmin == false) {
      sendErrorResponse.fourTwoTwo(errorMessages.userNotAut, res);
      return;
    }

    const validations = {
      name,
      email,
      password,
      confirmPassword,
    };

    for (const field in validations) {
      if (!validations[field]) {
        sendErrorResponse.fourTwoTwo(errorMessages[field], res);
        return;
      }
    }

    if (password.length < 6) {
      sendErrorResponse.fourTwoTwo(errorMessages.passwordInvalid, res);
      return;
    }

    if (password !== confirmPassword) {
      sendErrorResponse.fourTwoTwo(errorMessages.passwordMatch, res);
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ where: { email: email } });
    const isAdmin = true;
    const bit = true;

    // create a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    if (userExists) {
      if (userExists.bit == false) {
        try {
          await User.update(
            {
              password: passwordHash,
              bit: true,
              email,
              name
            },
            {
              where: { id: userExists.id }
            }
          );
          sendErrorResponse.fourTwoTwo(errorMessages.regReactivate, res);
          return;
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error', res });
        }
      } else {
        sendErrorResponse.fourTwoTwo(errorMessages.emailOr, res);
        return;
      }

    } else {
      try {
        const user = await User.create({ name, email, password: passwordHash, isAdmin, bit });
        await createUserToken(user, req, res);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

    }



  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      sendErrorResponse.fourTwoTwo(errorMessages.email, res);
      return;
    }

    if (!password) {
      sendErrorResponse.fourTwoTwo(errorMessages.password, res);
      return;
    }

    // check if user exists
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      sendErrorResponse.fourTwoTwo(errorMessages.existingEmail, res);
      return;
    }
    console.log('aqui');
    if (user.bit == false) {
      sendErrorResponse.fourTwoTwo(errorMessages.desativeUser, res);
      return;
    }

    // Check if password match with db password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      sendErrorResponse.fourTwoTwo(errorMessages.invalidePassword, res);
      return;
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser;


    if (req.headers.authorization) {
      const token = getToken(req);
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
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        sendErrorResponse.fourTwoTwo(errorMessages.notFound, res);
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
      });
    }
  }

  static async editUsers(req, res) {
    //check if user exists
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { name, email, password, confirmPassword } = req.body;

    //validations
    if (!name || !email) {
      sendErrorResponse.fourTwoTwo(errorMessages.requiredNameAnd, res);
      return;
    }

    try {
      //check if email has already taken
      const userExists = await User.findOne({ where: { email: email } });

      if (userExists && user.id !== userExists.id) {
        sendErrorResponse.fourTwoTwo(errorMessages.emailOr, res);
        return;
      }

      user.name = name;
      user.email = email;

      // Password validation
      if (password.length < 6) {
        sendErrorResponse.fourTwoTwo(errorMessages.passwordInvalid, res);
        return;
      }

      if (password != confirmPassword) {
        sendErrorResponse.fourTwoTwo(errorMessages.passwordMatch, res);
        return;
      } else if (password === confirmPassword && password != null) {
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash;
      }

      // Saves changes to the database
      await user.save();
      sendErrorResponse.twoZero(errorMessages.userUpdate, res);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });

    }
  }

  static async registerUsers(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    // validations
    const validations = {
      name,
      email,
      password,
      confirmPassword,
    };

    for (const field in validations) {
      if (!validations[field]) {
        sendErrorResponse.fourTwoTwo(errorMessages[field], res);
        return;
      }
    }

    if (password.length < 6) {
      sendErrorResponse.fourTwoTwo(errorMessages.passwordInvalid, res);
      return;
    }

    if (password !== confirmPassword) {
      sendErrorResponse.fourTwoTwo(errorMessages.passwordMatch, res);
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ where: { email: email } });

    const isAdmin = false;
    const bit = true;

    // create a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    if (userExists) {
      if (userExists.bit == false) {
        try {
          await User.update(
            {
              password: passwordHash,
              bit: true,
              email,
              isAdmin: false,
              name
            },
            {
              where: { id: userExists.id }
            }
          );
          sendErrorResponse.twoZero(errorMessages.regReactivate, res);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      } else {
        sendErrorResponse.fourTwoTwo(errorMessages.emailOr, res);
        return;
      }
    } else {
      try {
        const user = await User.create({ name, email, password: passwordHash, isAdmin, bit });
        await createUserToken(user, req, res);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  static async deleteUsers(req, res) {
    // validação para ver se admin
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (user.isAdmin == false) {
      sendErrorResponse.fourTwoTwo(errorMessages.userNotAut, res);
      return;
    }

    const { name, email } = req.body;

    //validations
    if (!name || !email) {
      sendErrorResponse.fourTwoTwo(errorMessages.requiredNameAnd, res);
      return;
    }

    const userExists = await User.findOne({ where: { email: email } });

    if (userExists == undefined) {
      sendErrorResponse.fourTwoTwo(errorMessages.emailOr, res);
      return;
    }

    if (userExists.name != name) {
      sendErrorResponse.fourTwoTwo(errorMessages.checkRemove, res);
      return;
    }


    try {
      // Gravação em Log 
      await Log.create({
        idAdmin: user.id,
        deleteName: userExists.name,
        deleteEmail: userExists.email,
        deleteIsAdmin: userExists.isAdmin
      });

      // Excluir o usuário
      await User.destroy({ where: { email } });

      sendErrorResponse.twoZero(errorMessages.userRemove, res);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).json({
        message: 'Erro interno do servidor ao excluir usuário',
      });
    }

  }

  static async deactivation(req, res) {

    const token = getToken(req);
    const user = await getUserByToken(token);
    //change of status
    user.bit = false;
    //save database
    await user.save();
    sendErrorResponse.twoZero(errorMessages.userUpdate, res);
  }

};
