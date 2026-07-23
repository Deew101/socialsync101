import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const getBasePath = () => {
  if (typeof window !== "undefined") {
    if (window.location.pathname.startsWith("/socialsync101")) {
      return "/socialsync101";
    }
  }
  return "/";
};

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    basepath: getBasePath(),
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
