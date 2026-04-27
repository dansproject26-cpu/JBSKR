export interface Job {
  id: string
  title: string
  company_id: string | null
  company_name: string
  company_logo: string | null
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote'
  category: string
  level: 'Entry' | 'Mid' | 'Senior' | 'Executive'
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  description: string
  requirements: string[]
  benefits: string[]
  skills: string[]
  is_featured: boolean
  is_active: boolean
  views: number
  deadline: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  logo_url: string | null
  website: string | null
  description: string | null
  industry: string | null
  size: string | null
  location: string | null
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'admin'
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  job_id: string
  user_id: string
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
  cover_letter: string | null
  resume_url: string | null
  created_at: string
}

export interface SearchFilters {
  query?: string
  category?: string
  location?: string
  type?: string
  level?: string
  salary_min?: number
}
