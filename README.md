# To-Do List Challenge

Aplicação de To-Do List construída com Next.js, TypeScript, Tailwind CSS e Supabase, seguindo uma arquitetura API-first preparada para automações com N8N e integrações com LLMs.

## 🏗️ Arquitetura

### Princípios de Design

**API-First Architecture**: O frontend **nunca** acessa o Supabase diretamente. Todas as operações de banco de dados passam pelas API Routes do Next.js (`/app/api/tasks/route.ts`). Isso oferece:

- **Separação de responsabilidades**: Lógica de negócio centralizada nas API routes
- **Preparação para automações**: Fácil adicionar webhooks N8N após operações
- **Segurança**: Credenciais do Supabase nunca expostas no cliente
- **Extensibilidade**: Pode adicionar validação, transformação de dados, e integrações sem modificar o frontend

### Fluxo de Dados

```
Frontend (React Components)
    ↓ fetch()
API Routes (/app/api/tasks/route.ts)
    ↓ Supabase Client
Supabase Database
```

### Estrutura do Projeto

```
todo-list-challenge/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       └── route.ts          # API routes (GET, POST, PATCH)
│   ├── globals.css               # Estilos globais Tailwind
│   ├── layout.tsx                # Layout raiz
│   └── page.tsx                  # Página principal
├── components/
│   ├── TaskForm.tsx              # Formulário para adicionar tasks
│   ├── TaskItem.tsx              # Componente individual de task
│   └── TaskList.tsx              # Lista de tasks
├── lib/
│   └── supabase.ts              # Cliente Supabase (server-side apenas)
└── ...
```

## 🚀 Setup

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Vá em **SQL Editor** e execute o seguinte SQL para criar a tabela:

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  user_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opcional: Criar índice para melhor performance
CREATE INDEX idx_tasks_user_name ON tasks(user_name);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

3. No painel do Supabase, vá em **Settings > API**
4. Copie a **URL do projeto** e a **anon key**
5. Para usar a Service Role Key (recomendado para este desafio), copie também a **service_role key** (mantenha-a segura!)

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e preencha com suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

### 4. Executar o Projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📋 Funcionalidades

- ✅ Adicionar novas tasks
- ✅ Marcar tasks como completas/incompletas
- ✅ Editar título de tasks
- ✅ Persistência no banco de dados (não usa localStorage)
- ✅ Cada task armazena um identificador de usuário (nome ou email)

## 🔮 Preparação para o Futuro

A arquitetura está preparada para extensões futuras:

### N8N Webhooks

No arquivo `/app/api/tasks/route.ts`, há comentários indicando onde adicionar chamadas de webhook:

```typescript
// TODO: Futuro - Chamar webhook N8N aqui
// await fetch(N8N_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(data) })
```

### Integração com LLM

Também há espaço preparado para melhorar títulos de tasks com LLM:

```typescript
// TODO: Futuro - Melhorar título com LLM aqui se necessário
// const enhancedTitle = await enhanceTitleWithLLM(title)
```

## 🛠️ Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL)
- **Vercel** (deploy target)

## 📝 Notas de Implementação

- **Sem autenticação**: Conforme especificado, não há sistema de autenticação
- **Service Role Key**: Usada para bypassar RLS, permitindo operações diretas no banco
- **Validação básica**: Validação mínima nas API routes (pode ser estendida)
- **Error handling**: Tratamento de erros básico implementado
- **UI minimalista**: Interface limpa e funcional usando Tailwind CSS

## 🚢 Deploy na Vercel

1. Faça push do código para um repositório Git
2. Conecte o repositório na Vercel
3. Adicione as variáveis de ambiente no painel da Vercel
4. Deploy automático!

## 📄 Licença

Este é um projeto de desafio técnico.

