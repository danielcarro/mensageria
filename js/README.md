# RabbitMQ Demo - Sistema Avançado de Mensageria

## Visão Geral do Projeto

Este projeto demonstra um sistema completo de mensageria utilizando RabbitMQ com Node.js, implementando os quatro tipos de exchanges (fanout, direct, topic e headers) em um cenário de e-commerce realista.

## 🚀 Recursos Principais

- **Sistema completo de mensageria** para um e-commerce
- **4 tipos de exchanges** implementados:
  - `fanout`: Para notificações globais
  - `direct`: Para roteamento preciso
  - `topic`: Para padrões complexos
  - `headers`: Para filtros baseados em metadados
- **Consumers especializados** para diferentes departamentos
- **Painel de monitoramento** integrado
- **Resiliência** com reconexão automática
- **Documentação completa** com exemplos práticos

## 📦 Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) (opcional para RabbitMQ)
- [RabbitMQ Management Plugin](https://www.rabbitmq.com/management.html) (recomendado)

## 🛠️ Configuração Rápida

```bash
# 1. Inicie o RabbitMQ com Docker
docker run -d --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=admin \
  rabbitmq:3-management

# 2. Clone o repositório
git clone https://github.com/seu-usuario/rabbitmq-demo.git
cd rabbitmq-demo

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente
cp .env.example .env
```

## 🏗️ Estrutura do Projeto

```
rabbitmq-demo/
├── src/
│   ├── publishers/
│   │   ├── fanout.publisher.js
│   │   ├── direct.publisher.js
│   │   ├── topic.publisher.js
│   │   └── headers.publisher.js
│   ├── consumers/
│   │   ├── finance.consumer.js
│   │   ├── inventory.consumer.js
│   │   ├── fiscal.consumer.js
│   │   └── notification.consumer.js
│   ├── lib/
│   │   ├── rabbitmq.js       # Conexão compartilhada
│   │   └── logger.js         # Sistema de logs unificado
│   └── monitor/
│       └── dashboard.js      # Painel de monitoramento
├── tests/
├── .env.example
├── package.json
└── README.md
```

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run start:fanout` | Publica mensagens fanout |
| `npm run start:direct` | Publica mensagens direct |
| `npm run start:topic` | Publica mensagens topic |
| `npm run start:headers` | Publica mensagens headers |
| `npm run start:finance` | Inicia consumer financeiro |
| `npm run start:inventory` | Inicia consumer de estoque |
| `npm run start:fiscal` | Inicia consumer fiscal |
| `npm run start:monitor` | Inicia painel de monitoramento |
| `npm run test` | Executa testes unitários |
| `npm run lint` | Verifica qualidade de código |

## 💡 Exemplo de Uso

### 1. Publicando Mensagens

```javascript
// Exemplo: publisher para pedidos
const { publish } = require('./lib/rabbitmq');

async function sendOrder(order) {
  await publish('orders.direct', 'order.created', order, {
    headers: {
      priority: 'high',
      department: 'finance'
    }
  });
}
```

### 2. Consumindo Mensagens

```javascript
// Consumer de financeiro
const { consume } = require('../lib/rabbitmq');

consume('finance.queue', async (message) => {
  const order = JSON.parse(message.content);
  console.log('Processando pagamento para pedido:', order.id);
  // Lógica de processamento...
}, { 
  exchange: 'orders.direct',
  routingKey: 'order.created',
  headers: { department: 'finance' }
});
```

## 📊 Monitoramento

Acesse o painel de monitoramento em:
```
http://localhost:15672
usuário: admin
senha: admin
```

Ou use nosso dashboard customizado:
```bash
npm run start:monitor
```

## 🛡️ Tratamento de Erros

O sistema inclui:
- Reconexão automática
- Dead Letter Queue para mensagens problemáticas
- Retry exponencial
- Logs detalhados

## 📈 Métricas

```javascript
// Exemplo: Coletando métricas
const { metrics } = require('./lib/monitoring');

setInterval(() => {
  console.log('Métricas atuais:', metrics.get());
}, 5000);
```



## 📄 Licença

MIT © [Daniel Carro](https://github.com/seu-usuario)