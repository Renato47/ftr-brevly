import { exportLinks } from '../functions/export-links'
import type { FastifyTypedInstance } from '../types'

export async function exportLinkRoute(app: FastifyTypedInstance) {
  app.post('/links/exports', async (request, reply) => {
    const { reportUrl } = await exportLinks()

    return reply.status(200).send({ reportUrl })
  })
}
