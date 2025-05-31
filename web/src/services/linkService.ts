import { downloadUrl } from '../utils/download-url'
import { api } from './api'

export type Link = {
  id: string
  shortenedUrl: string
  originalUrl: string
  accessCount: number
  createdAt: string
}

export async function createLink(
  shortenedUrl: string,
  originalUrl: string
): Promise<Link> {
  const link = (await api.post<Link>('/links', { shortenedUrl, originalUrl }))
    .data

  return link
}

export async function listLinks(): Promise<Link[]> {
  const links = (await api.get<Link[]>('links')).data

  return links
}

export async function deleteLink(id: string) {
  await api.delete(`links/${id}`, {
    headers: {
      'Content-Type': undefined,
    },
  })
}

export async function getUrl(shortenedUrl: string): Promise<Link | null> {
  const response = await api.get<Link>(`links/shortened/${shortenedUrl}`)

  if (response.status === 404) return null

  return response.data
}

export async function increaseAccess(id: string) {
  await api.patch(`links/${id}/access-increment`)
}

export async function downloadLinksCsv() {
  const response = await api.post('links/exports')

  downloadUrl(response.data.reportUrl)
}
