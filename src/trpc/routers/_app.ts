import { baseProcedure, createTRPCRouter } from "../init";
import { metricsRouter } from "./metrics";
import { roastsRouter } from "./roasts";

export const appRouter = createTRPCRouter({
	metrics: metricsRouter,
	roasts: roastsRouter,
	// Placeholder procedure for setup
	hello: baseProcedure.query(() => ({ message: "hello" })),
});

export type AppRouter = typeof appRouter;
