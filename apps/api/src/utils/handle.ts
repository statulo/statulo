import type {
  FastifyBaseLogger,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RouteGenericInterface,
  RouteHandlerMethod,
} from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { ResolveFastifyReplyReturnType } from "fastify/types/type-provider";
import { makeAuthContext } from "@/utils/auth/context";
import type { AuthContext } from "@/utils/auth/context";

export const DONT_REPLY = Symbol("dont-reply");

export type RequestContext<
  RawServer extends RawServerBase,
  RawRequest extends RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface,
  ContextConfig,
  SchemaCompiler extends FastifySchema,
  Logger extends FastifyBaseLogger,
> = {
  req: FastifyRequest<
    RouteGeneric,
    RawServer,
    RawRequest,
    SchemaCompiler,
    ZodTypeProvider,
    ContextConfig,
    Logger
  >;
  res: FastifyReply<
    RouteGeneric,
    RawServer,
    RawRequest,
    RawReply,
    ContextConfig,
    SchemaCompiler,
    ZodTypeProvider
  >;
  body: FastifyRequest<
    RouteGeneric,
    RawServer,
    RawRequest,
    SchemaCompiler,
    ZodTypeProvider,
    ContextConfig,
    Logger
  >["body"];
  params: FastifyRequest<
    RouteGeneric,
    RawServer,
    RawRequest,
    SchemaCompiler,
    ZodTypeProvider,
    ContextConfig,
    Logger
  >["params"];
  query: FastifyRequest<
    RouteGeneric,
    RawServer,
    RawRequest,
    SchemaCompiler,
    ZodTypeProvider,
    ContextConfig,
    Logger
  >["query"];
  auth: AuthContext;
};

export function handle<
  RawServer extends RawServerBase,
  RawRequest extends RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface,
  ContextConfig,
  SchemaCompiler extends FastifySchema,
  Logger extends FastifyBaseLogger,
>(
  handler: (
    ctx: RequestContext<
      RawServer,
      RawRequest,
      RawReply,
      RouteGeneric,
      ContextConfig,
      SchemaCompiler,
      Logger
    >,
  ) => ResolveFastifyReplyReturnType<
    ZodTypeProvider,
    SchemaCompiler,
    RouteGeneric
  >,
): RouteHandlerMethod<
    RawServer,
    RawRequest,
    RawReply,
    RouteGeneric,
    ContextConfig,
    SchemaCompiler,
    ZodTypeProvider,
    Logger
  > {
  const reqHandler: any = async (req: any, res: any) => {
    let result: any = handler({
      req,
      res,
      body: req.body,
      params: req.params,
      query: req.query,
      auth: await makeAuthContext(req),
    });
    if (result instanceof Promise) result = await result;
    if (result === DONT_REPLY) return res;
    res.send(result);
  };
  return reqHandler;
}
