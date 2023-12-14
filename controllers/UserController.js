const User = require('../models/user');
const Log = require('../models/log');

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers 
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
module.exports = class UserController {
  static async registerAdmin(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    // validations

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (user.isAdmin == false) {
      res.status(422).json({
        message: 'Usuário não autorizador !',
      })
      return
    }

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
    const isAdmin = true;
    const bit = true;

    // create a password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

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
          res.status(422).json({
            message: 'Cadastro reativado, atualizado dados e senha !',
          });
          return;
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      } else {
        res.status(422).json({
          message: 'Por favor, utilize outro e-mail',
        });
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

    if (user.bit == false) {
      res.status(422).json({
        message: 'Usuário desativado, fazer novo cadastro!',
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

  static async editUsers(req, res) {
    //check if user exists
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { name, email, password, confirmPassword } = req.body;

    //validations
    if (!name || !email) {
      res.status(422).json({ message: 'Nome e email são obrigatórios' });
      return;
    }

    try {
      //check if email has already taken
      const userExists = await User.findOne({ where: { email: email } });

      if (userExists && user.id !== userExists.id) {
        res.status(422).json({
          message: 'Por favor, utilize outro e-mail!',
        })
        return;
      }

      user.name = name;
      user.email = email;

      // Password validation
      if (password.length < 6) {
        sendErrorResponse('A senha deve ter no mínimo 6 caracteres.');
        return;
      }

      if (password != confirmPassword) {
        res.status(422).json({ message: 'As senhas não conferem!' })
        return
      } else if (password === confirmPassword && password != null) {
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        user.password = passwordHash
      }

      // Saves changes to the database
      await user.save();

      res.status(200).json({
        message: 'Usuário atualizado com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });

    }
  }

  static async registerUsers(req, res) {
    const { name, email, password, confirmPassword } = req.body;

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

    const isAdmin = false;
    const bit = true;

    // create a password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

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
          res.status(422).json({
            message: 'Cadastro reativado, atualizado dados e senha !',
          });
          return;
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      } else {
        res.status(422).json({
          message: 'Por favor, utilize outro e-mail',
        });
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
      res.status(422).json({
        message: 'Usuário não autorizador !',
      })
      return
    }

    const { name, email } = req.body;

    //validations
    if (!name || !email) {
      res.status(422).json({ message: 'Nome e email são obrigatórios' });
      return;
    }

    const userExists = await User.findOne({ where: { email: email } });

    if (userExists == undefined) {
      res.status(422).json({
        message: 'Por favor, utilize outro e-mail!',
      })
      return;
    }

    if (userExists.name != name) {
      res.status(422).json({
        message: 'Por favor, verifique o nome a ser removido!',
      })
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

      res.status(200).json({
        message: 'Usuário removido com sucesso!',
      });

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
    user.bit = false
    //save database
    await user.save()
    res.status(200).json({
      message: 'Usuário atualizado com sucesso!',
    });

  }

};
