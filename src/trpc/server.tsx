import "server-only";

import {
	type TRPCQueryOptions,
	createTRPCOptionsProxy,
} from "@trpc/tanstack-react-query";
import {
	HydrationBoundary,
	dehydrate,
} from "@tanstack/react-query";
import { cache } from "react";
import { createTRPCContext, createCallerFactory } from "./init";
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

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
	queryOptions: T,
) {
	const queryClient = getQueryClient();
	if (queryOptions.queryKey[1]?.type === "infinite") {
		return queryClient.prefetchInfiniteQuery(queryOptions as any);
	}
	return queryClient.prefetchQuery(queryOptions);
}
