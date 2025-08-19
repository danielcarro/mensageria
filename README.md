# RabbitMQ Demo + Sistema de Pedidos

## Visão Geral

Este repositório combina duas tecnologias para demonstrar um sistema completo de mensageria com RabbitMQ:

### 🟢 Projeto Node.js
- Implementação completa dos 4 tipos de exchanges RabbitMQ:
  - `fanout` para broadcast
  - `direct` para roteamento direto
  - `topic` para padrões complexos
  - `headers` para filtragem por metadados
- Sistema de publishers e consumers resiliente
- Painel de monitoramento integrado

### 🟠 Projeto PHP
- Interface web para gestão de pedidos
- Worker assíncrono para processamento
- Armazenamento em SQLite
- Integração bidirecional com Node.js via RabbitMQ

## 📦 Estrutura do Projeto

```
rabbitmq-demo/
├── node-app/          # Aplicação Node.js
│   ├── src/           # Código fonte
│   └── tests/         # Testes unitários
│
├── php-app/           # Aplicação PHP 
│   ├── public/        # Frontend web
│   ├── src/           # Lógica de negócio
│   └── workers/       # Processadores assíncronos
│
└── docker-compose.yml # Configuração Docker
```

## 🚀 Como Executar

1. Inicie os containers:
```bash
docker-compose up -d
```

2. Configure as aplicações:
```bash
# Node.js
cd node-app
npm install

# PHP
cd php-app
composer install
```

3. Acesse as interfaces:
- **PHP Frontend**: http://localhost:8080
- **Node.js Monitor**: http://localhost:3000/monitor
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)

## 📜 Licenças

- **Node.js**: [Licença ISC](https://opensource.org/licenses/ISC)
- **PHP**: [Licença MIT](https://opensource.org/licenses/MIT)

## 👨💻 Autor

Daniel Carro

