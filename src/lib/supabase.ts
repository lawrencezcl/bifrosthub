import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://gphxrmkibuythbcopkmo.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwaHhybWtpYnV5dGhiY29wa21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDEzNTksImV4cCI6MjA3NDI3NzM1OX0.yaqjBv0AGSF2SdoV-2OoSuwNrECv4CAA2zEc4ElDp9M"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
