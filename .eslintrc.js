module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    indent: ['error', 2], // Dois espaços de indentação
    quotes: ['error', 'single'], // Aspas simples
    semi: ['error', 'always'], // Sempre usar ponto e vírgula no final de uma instrução
    'no-unused-vars': 'error', // Variáveis declaradas, mas não utilizadas são um erro
  },
};
