import {
  exportLinks
} from "./chunk-7QAQJCHF.mjs";

// src/routes/export-link.ts
async function exportLinkRoute(app) {
  app.post("/links/exports", async (request, reply) => {
    const { reportUrl } = await exportLinks();
    return reply.status(200).send({ reportUrl });
  });
}

export {
  exportLinkRoute
};
