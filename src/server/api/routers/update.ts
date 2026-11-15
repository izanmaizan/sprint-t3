import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const updateRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ workspaceSlug: z.string(), limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.update.findMany({
        where: { workspace: { slug: input.workspaceSlug } },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        include: { member: { select: { name: true } } },
      });
    }),

  create: protectedProcedure
    .input(z.object({ workspaceSlug: z.string(), body: z.string().min(3).max(2000), mood: z.enum(["good", "normal", "blocked"]) }))
    .mutation(async ({ ctx, input }) => {
      const email = ctx.session.user?.email ?? "";
      const workspace = await ctx.db.workspace.findUniqueOrThrow({ where: { slug: input.workspaceSlug } });
      const member = await ctx.db.member.upsert({
        where: { email },
        update: {},
        create: { email, name: email.split("@")[0] ?? "member", workspaceId: workspace.id },
      });
      return ctx.db.update.create({
        data: { body: input.body, mood: input.mood, memberId: member.id, workspaceId: workspace.id },
      });
    }),
});
