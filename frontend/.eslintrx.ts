module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'next',
        'next/core-web-vitals',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    plugins: ['@typescript-eslint'],
    rules: {
        // Adicione regras personalizadas aqui
    },
};
