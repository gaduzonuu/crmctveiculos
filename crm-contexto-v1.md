# CRM CTVeiculos — Contexto da V1

## Objetivo
Criar um CRM web separado da aplicação principal para visualizar conversas de leads vindas do WhatsApp, com foco operacional.

A V1 deve permitir:
- login de usuários internos do CRM
- listagem de leads
- seleção de lead
- visualização da conversa
- exibição de dados estruturados do lead
- layout estilo chat, limpo e profissional

## Arquitetura
Este projeto deve ser separado da aplicação principal.

Arquitetura desejada:
Frontend React → Backend Express → Supabase + Redis

### Regras importantes
- O frontend NÃO deve acessar Redis diretamente
- O frontend NÃO deve acessar Supabase diretamente
- Toda comunicação deve passar pelo backend do CRM
- O Redis será acessado apenas pelo backend
- O Supabase será acessado apenas pelo backend

## Stack desejada
- Frontend: React + Vite
- Backend: Express
- Estilização: solução simples, limpa e profissional
- Autenticação: login por email e senha
- Senha com hash (bcrypt)
- Token JWT ou estratégia equivalente simples e segura
- Projeto preparado para Docker
- Variáveis de ambiente organizadas

## Estrutura desejada do projeto
crm-ctveiculos/
  frontend/
  backend/
  docker-compose.yml
  .env.example
  README.md

## Escopo da V1

### Backend
Implementar:
- servidor Express
- autenticação
- login
- middleware de autenticação
- rota para listar leads
- rota para buscar dados de um lead
- rota para buscar mensagens de um lead no Redis
- integração com Supabase
- integração com Redis
- tratamento básico de erros
- organização por rotas / controllers / services / middlewares

### Frontend
Implementar:
- tela de login
- tela principal do CRM
- lista de leads
- painel de conversa
- painel com informações do lead
- consumo da API do backend
- autenticação simples
- layout responsivo básico

## Layout
A interface deve ser inspirada em um chat moderno.

Estrutura visual desejada:
- coluna esquerda com lista de leads
- área central com mensagens
- painel lateral ou bloco à direita com informações do lead
- sem menu lateral desnecessário
- sem analytics nessa V1
- sem telas extras desnecessárias
- aparência profissional, clara e limpa

## Supabase
O Supabase já possui uma tabela de leads usada pela automação.

Campos relevantes:
- phone
- name
- last_message
- last_response
- intent
- vehicle_interest
- payment_method
- has_down_payment
- has_trade_in
- city
- urgency
- visit_interest
- lead_temperature
- lead_score
- stage
- human_handoff

O projeto deve ser preparado para consumir essa tabela existente.

Além disso, criar uma nova tabela para usuários internos do CRM com estrutura mínima como:

- id
- name
- email
- password_hash
- role
- active
- created_at
- last_login_at

## Redis — formato real
As conversas estão armazenadas no Redis.

### Estrutura das chaves
- cada lead possui uma key própria
- o nome da key é o número de telefone do lead
- exemplo: "5511947278793"

### Tipo
- LIST

### Leitura
- usar LRANGE para buscar as mensagens

### Formato dos itens
Cada item da lista é um JSON serializado, com estrutura como:

{
  "type": "human" | "ai" | "tool",
  "data": {
    "content": "texto ou JSON em string"
  }
}

### Regras de parsing
O backend deve transformar as mensagens antes de enviar ao frontend.

#### type = human
- role = "user"
- content = data.content

#### type = ai
- tentar fazer parse do content
- se existir propriedade "reply", usar "reply"
- se não existir, usar o conteúdo bruto

#### type = tool
- não exibir no frontend
- pode ser ignorado na resposta final ao frontend

### Saída desejada para o frontend
Retornar mensagens limpas no formato:
[
  { "role": "user", "content": "Olá" },
  { "role": "assistant", "content": "Fala, tudo bem?" }
]

## Regras importantes de implementação
- não inventar integrações desnecessárias
- não criar telas além da V1
- não criar menus falsos
- não acoplar Redis ao frontend
- não misturar esse projeto com a aplicação principal
- manter código simples, legível e fácil de evoluir

## Fluxo de trabalho esperado
Antes de implementar:
1. analisar este arquivo
2. propor a arquitetura resumida
3. listar a estrutura de pastas e arquivos principais
4. só depois começar a implementação

## Qualidade esperada
- código limpo
- sem overengineering
- sem abstrações desnecessárias
- foco em funcionamento real da V1
- projeto pronto para desenvolvimento local