-- Script SQL para criar a tabela tasks no Supabase
-- Execute este script no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  user_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_name ON tasks(user_name);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

-- Comentários para documentação
COMMENT ON TABLE tasks IS 'Tabela para armazenar tasks da aplicação To-Do List';
COMMENT ON COLUMN tasks.id IS 'Identificador único da task (UUID)';
COMMENT ON COLUMN tasks.title IS 'Título/descrição da task';
COMMENT ON COLUMN tasks.completed IS 'Indica se a task está completa';
COMMENT ON COLUMN tasks.user_name IS 'Identificador do usuário (nome ou email)';
COMMENT ON COLUMN tasks.created_at IS 'Data e hora de criação da task';

