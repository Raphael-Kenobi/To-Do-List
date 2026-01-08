# To-Do List Challenge

To-Do List application built with Next.js, TypeScript, Tailwind CSS, and Supabase, following an API-first architecture prepared for N8N automations and LLM integrations.

## 🏗️ Architecture

### Design Principles

**API-First Architecture**: The frontend **never** accesses Supabase directly. All database operations go through Next.js API Routes (`/app/api/tasks/route.ts`). This offers:

- **Separation of concerns**: Business logic centralized in API routes
- **Automation readiness**: Easy to add N8N webhooks after operations
- **Security**: Supabase credentials never exposed to the client
- **Extensibility**: Can add validation, data transformation, and integrations without modifying the frontend

### Data Flow

```
Frontend (React Components)
    ↓ fetch()
API Routes (/app/api/tasks/route.ts)
    ↓ Supabase Client
Supabase Database
```

### Project Structure

```
todo-list-challenge/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       └── route.ts          # API routes (GET, POST, PATCH)
│   ├── globals.css               # Global Tailwind styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── TaskForm.tsx              # Form to add tasks
│   ├── TaskItem.tsx              # Individual task component
│   └── TaskList.tsx              # List of tasks
├── lib/
│   └── supabase.ts              # Supabase client (server-side only)
└── ...
```

## 🚀 Setup

### Prerequisites

- Node.js 18+ installed
- Supabase account (free)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project on [Supabase](https://supabase.com)
2. Go to **SQL Editor** and execute the following SQL to create the table:

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  user_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Create index for better performance
CREATE INDEX idx_tasks_user_name ON tasks(user_name);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

3. In the Supabase dashboard, go to **Settings > API**
4. Copy the **Project URL** and the **anon key**
5. To use the Service Role Key (recommended for this challenge), also copy the **service_role key** (keep it safe!)

### 3. Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

2. Edit the `.env.local` file and fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Lovable
LOVABLE_API_KEY=your_lovable_api_key
LOVABLE_PROJECT_ID=your_lovable_project_id
```

### 4. Run the Project

```bash
npm run dev
```

Access [http://localhost:3000](http://localhost:3000)

## 📋 Features

- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Edit task titles
- ✅ Database persistence (does not use localStorage)
- ✅ Each task stores a user identifier (name or email)

## 🔮 Future Readiness

The architecture is prepared for future extensions:

### N8N Webhooks

In `/app/api/tasks/route.ts`, there are comments indicating where to add webhook calls:

```typescript
// TODO: Future - Call N8N webhook here
// await fetch(N8N_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(data) })
```

### LLM Integration

There is also space prepared to enhance task titles with LLM:

```typescript
// TODO: Future - Enhance title with LLM here if necessary
// const enhancedTitle = await enhanceTitleWithLLM(title)
```

## 🛠️ Technologies

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL)
- **Vercel** (deploy target)

## 📝 Implementation Notes

- **No authentication**: As specified, there is no authentication system
- **Service Role Key**: Used to bypass RLS, allowing direct database operations
- **Basic validation**: Minimal validation in API routes (can be extended)
- **Error handling**: Basic error handling implemented
- **Minimalist UI**: Clean and functional interface using Tailwind CSS

## 🚢 Deploy on Vercel

1. Push the code to a Git repository
2. Connect the repository to Vercel
3. Add the environment variables in the Vercel dashboard
4. Automatic deploy!

## 📄 License

This is a technical challenge project.
