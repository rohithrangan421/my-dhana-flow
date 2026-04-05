CREATE TABLE public.budget_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, year, month)
);

CREATE TABLE public.salaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, year, month)
);

ALTER TABLE public.budget_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budget data" ON public.budget_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budget data" ON public.budget_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budget data" ON public.budget_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budget data" ON public.budget_data FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own salary" ON public.salaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own salary" ON public.salaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own salary" ON public.salaries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own salary" ON public.salaries FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_budget_data_updated_at BEFORE UPDATE ON public.budget_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_salaries_updated_at BEFORE UPDATE ON public.salaries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();