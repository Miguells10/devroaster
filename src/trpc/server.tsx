import "server-only";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
	createTRPCOptionsProxy,
	type TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

const createCaller = createCallerFactory(appRouter);
export const api = createCaller(createTRPCContext);

export const trpc = createTRPCOptionsProxy({
	ctx: createTRPCContext,
	router: appRouter,
	queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			{props.children}
		</HydrationBoundary>
	);
}

// biome-ignore lint/suspicious/noExplicitAny: Generic wrapper for tRPC query options
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
	queryOptions: T,
) {
	const queryClient = getQueryClient();
	if (queryOptions.queryKey[1]?.type === "infinite") {
		// biome-ignore lint/suspicious/noExplicitAny: Required for TanStack Query compatibility
		return queryClient.prefetchInfiniteQuery(queryOptions as any);
	}
	return queryClient.prefetchQuery(queryOptions);
}
