import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://otmttpiqeehfquoqycol.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bXR0cGlxZWVoZnF1b3F5Y29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MjczNDksImV4cCI6MjA2NTMwMzM0OX0.JvchtObtT7qNZCM7Axzqv0odnK3qevKuctuhx9TWEjs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
