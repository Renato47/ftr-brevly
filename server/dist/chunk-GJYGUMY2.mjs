import {
  db
} from "./chunk-SQDV7QSX.mjs";
import {
  schema
} from "./chunk-Y3FI4ECG.mjs";

// src/routes/link.ts
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
async function linkRoute(app) {
  app.post(
    "/links",
    {
      schema: {
        body: z.object({
          shortenedUrl: z.string(),
          originalUrl: z.string()
        })
      }
    },
    async (request, reply) => {
      const { shortenedUrl, originalUrl } = request.body;
      const existingShortenedLink = (await db.select().from(schema.links).where(eq(schema.links.shortenedUrl, shortenedUrl)))[0];
      if (existingShortenedLink)
        return await reply.status(409).send({ message: "shortened url already exists" });
      const link = (await db.insert(schema.links).values({
        shortenedUrl,
        originalUrl,
        accessCount: 0
      }).returning())[0];
      await reply.status(201).send(link);
    }
  );
  app.get("/links", async (request, reply) => {
    const links = await db.query.links.findMany({
      orderBy: [desc(schema.links.createdAt)]
    });
    await reply.status(200).send(links);
  });
  app.delete(
    "/links/:id",
    {
      schema: {
        params: z.object({
          id: z.string()
        })
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const existingLink = (await db.select().from(schema.links).where(eq(schema.links.id, id)))[0];
      if (!existingLink)
        return await reply.status(404).send({ message: "link not found" });
      await db.delete(schema.links).where(eq(schema.links.id, id));
      await reply.status(204).send();
    }
  );
  app.get(
    "/links/shortened/:url",
    {
      schema: {
        params: z.object({
          url: z.string()
        })
      }
    },
    async (request, reply) => {
      const { url } = request.params;
      const link = (await db.select().from(schema.links).where(eq(schema.links.shortenedUrl, url)))[0];
      if (!link)
        return await reply.status(404).send({ message: "link not found" });
      await reply.status(200).send(link);
    }
  );
  app.patch(
    "/links/:id/access-increment",
    {
      schema: {
        params: z.object({
          id: z.string()
        })
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const existingLink = (await db.select().from(schema.links).where(eq(schema.links.id, id)))[0];
      if (!existingLink)
        return await reply.status(404).send({ message: "link not found" });
      const link = (await db.update(schema.links).set({ accessCount: sql`access_count + 1` }).where(eq(schema.links.id, id)).returning())[0];
      await reply.status(200).send(link);
    }
  );
}

export {
  linkRoute
};
