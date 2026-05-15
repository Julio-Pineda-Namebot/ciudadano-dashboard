export interface News {
  id: string
  title: string
  summary: string
  content: string
  image: string
  date: string
  tag: string
  createdAt?: string
  updatedAt?: string
}

export type NewsFormData = Omit<News, 'id' | 'createdAt' | 'updatedAt'>
