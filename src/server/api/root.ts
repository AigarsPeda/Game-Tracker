import { participantRouter } from "./routers/participant";
import { tournamentsRouter } from "./routers/tournaments";
import { usersRouter } from "./routers/users";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  tournaments: tournamentsRouter,
  participant: participantRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
