'use server'

import type { News, NewsFormData } from './_types/news'

// ─── Mock data (activo) ───────────────────────────────────────────────────────

const INITIAL_NEWS: News[] = [
  {
    id: 1,
    title: 'Ministerio Público de Ica y PNP coordinan acciones conjuntas para fortalecer lucha contra la inseguridad ciudadana',
    summary: 'La presidenta de la Junta de Fiscales Superiores del Distrito Fiscal de Ica, fiscal superior Carmen Rosa Delgado Ccana...',
    content: 'La presidenta de la Junta de Fiscales Superiores del Distrito Fiscal de Ica, fiscal superior Carmen Rosa Delgado Ccana, realizó una reunión de coordinación con la Policía Nacional, con el fin de abordar temas relacionados a la seguridad ciudadana y al fortalecimiento de la coordinación entre ambas instituciones...',
    image: 'https://detrujillo.com/wp-content/uploads/2018/04/upao-y-pnp-coordinan-trabajo-en-equipo.jpg',
    date: '2025-10-16',
    tag: 'seguridad',
  },
  {
    id: 2,
    title: 'Delincuentes asaltan minimarket en pleno centro de la ciudad',
    summary: 'Dos sujetos armados ingresaron a un local comercial y se llevaron dinero en efectivo y productos...',
    content: 'El hecho ocurrió la noche del martes en la Av. Grau. Los delincuentes amenazaron con armas de fuego a los empleados del minimarket y huyeron en una motocicleta sin placas. La Policía ya inició las investigaciones con ayuda de cámaras de seguridad.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDYPZnVt_aK5fietAVu7cFgQBC1CYU8b4DNQ&s',
    date: '2025-10-16',
    tag: 'robo',
  },
  {
    id: 3,
    title: 'Senamhi advierte intensas lluvias y viento en la región',
    summary: 'El Servicio Nacional de Meteorología e Hidrología anunció precipitaciones con tormentas eléctricas en varias provincias...',
    content: 'Las lluvias estarán acompañadas de ráfagas de viento y podrían causar deslizamientos en zonas vulnerables. Se recomienda a la población tomar precauciones, especialmente en áreas de riesgo como quebradas y laderas.',
    image: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/IJM7ELSBL5GSRDF4PERZDVMRRI.jpg',
    date: '2025-10-16',
    tag: 'clima',
  },
  {
    id: 4,
    title: 'Vehículo se incendia en vía expresa causando gran congestión vehicular',
    summary: 'Un auto particular se incendió esta mañana en la vía expresa de Paseo de la República. No se reportaron heridos...',
    content: 'El incendio fue controlado por los bomberos, pero causó gran congestión vehicular durante más de una hora. Las autoridades investigan si el incidente fue causado por una falla mecánica o un cortocircuito.',
    image: 'https://portal.andina.pe/EDPfotografia3/Thumbnail/2018/03/28/000492507W.jpg',
    date: '2025-10-16',
    tag: 'tránsito',
  },
  {
    id: 5,
    title: 'PNP captura a banda criminal que operaba en los alrededores de colegios',
    summary: 'La Policía Nacional detuvo a cuatro integrantes de una banda que robaba celulares a escolares en la salida de sus centros educativos...',
    content: 'Gracias a la denuncia de varios padres de familia y el seguimiento con cámaras de seguridad, la PNP logró intervenir a los delincuentes en flagrancia mientras intentaban huir en una mototaxi. El operativo se realizó en coordinación con Serenazgo y Fiscalía. La población aplaudió la rápida acción policial.',
    image: 'https://portal.andina.pe/EDPfotografia3/Thumbnail/2023/04/14/000950034W.jpg',
    date: '2025-10-16',
    tag: 'seguridad',
  },
]

let mockStore: News[] = [...INITIAL_NEWS]
let nextId = mockStore.length + 1

export async function getNews(): Promise<News[]> {
  return [...mockStore]
}

export async function createNews(data: NewsFormData): Promise<News> {
  const news: News = { id: nextId++, ...data }
  mockStore = [...mockStore, news]
  return news
}

export async function updateNews(id: number, data: NewsFormData): Promise<News> {
  const updated: News = { id, ...data }
  mockStore = mockStore.map((n) => (n.id === id ? updated : n))
  return updated
}

export async function deleteNews(id: number): Promise<void> {
  mockStore = mockStore.filter((n) => n.id !== id)
}

// ─── Backend (comentado — descomentar cuando el backend esté listo) ────────────

// import { get, post, put, del } from '@/lib/backendService'
// import { getSession } from '@/lib/session'
//
// async function authHeaders() {
//   const token = await getSession()
//   return { Authorization: `Bearer ${token}` }
// }
//
// export async function getNews(): Promise<News[]> {
//   const res = await get<{ data: News[] }>('/admin/news', { headers: await authHeaders() })
//   return res.data
// }
//
// export async function createNews(data: NewsFormData): Promise<News> {
//   const res = await post<{ data: News }>('/admin/news', data, { headers: await authHeaders() })
//   return res.data
// }
//
// export async function updateNews(id: number, data: NewsFormData): Promise<News> {
//   const res = await put<{ data: News }>(`/admin/news/${id}`, data, { headers: await authHeaders() })
//   return res.data
// }
//
// export async function deleteNews(id: number): Promise<void> {
//   await del(`/admin/news/${id}`, { headers: await authHeaders() })
// }
