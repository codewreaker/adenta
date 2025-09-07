export interface ProjectOptions {
  dir: string;
  name?: string;
  template: 'blank' | 'website' | 'ecommerce' | 'admin';
  supabase: boolean
}

export interface CommandOptions {
    init: ProjectOptions
}