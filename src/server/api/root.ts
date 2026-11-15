import { createTRPCRouter } from "~/server/api/trpc";
import { updateRouter } from "~/server/api/routers/update";

export const appRouter = createTRPCRouter({
  update: updateRouter,
});

export type AppRouter = typeof appRouter;
