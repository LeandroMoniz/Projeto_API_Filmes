



module.exports = class UserController {
    static async registerAdmin(req, res) {
        const { name, email, password, confirmpassword } = req.body

        // validations

        const errorMessages = {
            name: 'O nome é obrigatório',
            email: 'O email é obrigatório',
            phone: 'O telefone é obrigatório',
            password: 'A senha é obrigatória',
            confirmpassword: 'A confirmação de senha é obrigatória',
            passwordMatch: 'A senha e a confirmação de senha não são iguais!',
        };

        const sendErrorResponse = (message) => {
            res.status(422).json({ message });
        };

        const validations = {
            name,
            email,
            phone,
            password,
            confirmpassword,
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

        if (password !== confirmpassword) {
            sendErrorResponse(errorMessages.passwordMatch);
            return;
        }

        // check if user exists
        const userExists = await User.findOne({ email: email })

        if (userExists) {
            res.status(422).json({
                message: 'Por favor, utilize outro e-mail',
            })
            return
        }

        const isAdmin = true;

        try {
            const user = await User.create({ name, email, password, isAdmin });
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }


    }

}