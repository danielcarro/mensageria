# RabbitMQ Demo + Sistema de Pedidos

Este repositório contém **dois projetos distintos** que demonstram o uso do **RabbitMQ**:

1. **Node.js**: Publisher/Consumer com diferentes tipos de exchanges (`fanout`, `direct`, `topic`, `headers`).  
2. **PHP**: Sistema de pedidos simples com interface web, consumindo mensagens RabbitMQ e atualizando o banco SQLite.

---

## Estrutura do Repositório

.
├── js/ # Projeto Node.js com publishers e consumers
├── php/ # Projeto PHP com sistema de pedidos
└── README.md


---

## 1️⃣ Projeto Node.js (RabbitMQ Demo)

### Descrição
Exemplo de publisher e múltiplos consumers para entender padrões de mensageria em Node.js usando RabbitMQ.

### Pré-requisitos
- Node.js >= 18
- RabbitMQ rodando localmente (`amqp://guest:guest@localhost:5672`)  
  ou via Docker:
  ```bash
  docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management


Instalação
cd js
npm install

Scripts

Publishers

npm run publish-fanout     # Envia mensagem para exchange fanout
npm run publish-direct     # Envia mensagem para exchange direct
npm run publish-topic      # Envia mensagem para exchange topic
npm run publish-headers    # Envia mensagem para exchange headers

Consumers
npm run consume-financeiro  # Consome mensagens relacionadas ao financeiro
npm run consume-estoque     # Consome mensagens relacionadas ao estoque
npm run consume-fiscal      # Consome mensagens relacionadas à nota fiscal

Monitor

npm run monitor             # Observa atividades no RabbitMQ


Estrutura

js/
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

2️⃣ Projeto PHP (Sistema de Pedidos)
Descrição

Sistema de pedidos usando PHP, RabbitMQ e SQLite, com interface web em HTML/Bootstrap.

Tecnologias

PHP 8.x

RabbitMQ

SQLite

Bootstrap 5

Composer

PhpAmqpLib

Instalação

cd php
composer install


Configure RabbitMQ (Docker recomendado):
docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

Crie o banco SQLite se não existir (db/pedidos.db):

CREATE TABLE Pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produtos TEXT,
  email INTEGER DEFAULT 0,
  distributor INTEGER DEFAULT 0,
  payment INTEGER DEFAULT 0
);


Como usar

Interface Web

Abra public/index.html no navegador

Inserir novos pedidos

Visualizar status atualizado a cada 7 segundos

Scripts PHP

store_pedido.php → envia pedidos para RabbitMQ e salva no banco

Consumers:

php receivePedido.php       # Atualiza payment
php receiveDistributor.php  # Atualiza distributor
php receiveEmail.php        # Atualiza email

Configuração RabbitMQ

Host: 127.0.0.1

Porta: 5672

Usuário: guest

Senha: guest

Filas

pedido_exchange (fanout)

payment_queue

distributor_queue

email_queue

Observações

Mensagens persistentes (delivery_mode = 2) para confiabilidade

Front-end usa AJAX para interagir com a API PHP

Testado em Windows e Docker

Autor

Daniel Carro

Licença

Projeto Node.js: ISC

Projeto PHP: MIT
