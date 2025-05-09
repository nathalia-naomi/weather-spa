# 🌤️ Weather SPA

Aplicação web em React.js para consulta do clima de qualquer cidade, utilizando a API JSON do [WeatherStack](https://weatherstack.com/).

Repositório oficial: [https://github.com/nathalia-naomi/weather-spa](https://github.com/nathalia-naomi/weather-spa)

---

## 🧱 Estrutura do Projeto

src/
├── components/ # Componentes reutilizáveis em JSX
│ ├── ErrorMessage.jsx
│ ├── SearchForm.jsx
│ └── WeatherCard.jsx
├── contexts/ # Context API para estado global
│ └── WeatherContext.jsx
├── App.js # Componente principal
└── index.js # Ponto de entrada da aplicação

## 🚀 Tecnologias Utilizadas

- [React.js](https://reactjs.org/)
- [Context API](https://reactjs.org/docs/context.html)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Yup](https://github.com/jquense/yup)
- [WeatherStack API](https://weatherstack.com/)
- [Create React App](https://create-react-app.dev/)

---

## 📦 Instalação

```bash
git clone https://github.com/nathalia-naomi/weather-spa.git
cd weather-spa
npm install

## Funcionalidades
SPA (Single Page Application)

Busca de clima por cidade

Validação de campo obrigatório com yup

Mensagens de erro antes e após a requisição

Componente de exibição com imagem, temperatura e descrição

Uso de Context API para controle de estado global