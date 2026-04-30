export interface News {
  id: number
  title: string
  summary: string
  content: string
  image: string
  date: string
  tag: string
}

export type NewsFormData = Omit<News, 'id'>
