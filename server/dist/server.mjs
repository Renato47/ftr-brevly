import {
  exportLinkRoute
} from "./chunk-TK76PFZJ.mjs";
import "./chunk-7QAQJCHF.mjs";
import "./chunk-5QUUGPAE.mjs";
import {
  linkRoute
} from "./chunk-GJYGUMY2.mjs";
import "./chunk-SQDV7QSX.mjs";
import "./chunk-Y3FI4ECG.mjs";
import "./chunk-EQPUX444.mjs";
import "./chunk-XIJV7CBZ.mjs";
import {
  env
} from "./chunk-ZICOLQTR.mjs";

// src/server.ts
import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";
import {
  validatorCompiler
} from "fastify-type-provider-zod";
var server = fastify().withTypeProvider();
server.setValidatorCompiler(validatorCompiler);
server.register(fastifyCors, {
  origin: "*",
  methods: "*"
});
server.register(linkRoute);
server.register(exportLinkRoute);
server.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log(`HTTP server running on port ${env.PORT}!`);
});
