# RabbitMQ Demo

Exemplo de publisher / exchanges e múltiplos consumers com RabbitMQ.

## Descrição

Este projeto demonstra como criar um sistema de mensageria usando RabbitMQ, com diferentes tipos de exchanges (`fanout`, `direct`, `topic` e `headers`) e múltiplos consumidores para filas específicas.  
É útil para entender padrões de publicação e consumo de mensagens em aplicações Node.js.

## Pré-requisitos

- Node.js >= 18
- RabbitMQ rodando localmente (padrão: `amqp://guest:guest@localhost:5672`)

Você pode usar o [Docker](https://www.docker.com/) para rodar o RabbitMQ rapidamente:

```bash
docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management


git clone <URL_DO_REPOSITORIO>
cd rabbitmq-demo

npm install

Scripts
Publishers

npm run publish-fanout – envia mensagem para exchange fanout.

npm run publish-direct – envia mensagem para exchange direct.

npm run publish-topic – envia mensagem para exchange topic.

npm run publish-headers – envia mensagem para exchange headers.

Consumers

npm run consume-financeiro – consome mensagens relacionadas ao financeiro.

npm run consume-estoque – consome mensagens relacionadas ao estoque.

npm run consume-fiscal – consome mensagens relacionadas à nota fiscal.

Monitor

npm run monitor – executa o script monitor-rabbitmq.js para observar atividades no RabbitMQ.

Estrutura do Projeto
.
├── publisher-fanout.js
├── publisher-direct.js
├── publisher-topic.js
├── publisher-headers.js
├── consumer_financeiro.js
├── consumer_estoque.js
├── consumer_nota_fiscal.js
├── monitor-rabbitmq.js
├── package.json
└── README.md

Autor

Daniel Carro

Licença

ISC
