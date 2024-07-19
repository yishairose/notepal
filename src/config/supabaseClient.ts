import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ceacpgvgqjfelvzagukl.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlYWNwZ3ZncWpmZWx2emFndWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA5NzcyNDgsImV4cCI6MjAzNjU1MzI0OH0.Tecolj0QqloN5qURzOeLidTQ2si-QNxYtdAewYV_DDI";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
