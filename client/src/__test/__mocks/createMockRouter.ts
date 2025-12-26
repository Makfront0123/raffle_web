import { NextRouter } from "next/router";
export function createMockRouter(router: Partial<NextRouter> = {}): NextRouter {
  return {
    basePath: "",
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: "en",
    domainLocales: [],
    locales: ["en"],
    locale: "en",
    isPreview: false,
    ...router,
  } as unknown as NextRouter;
}
