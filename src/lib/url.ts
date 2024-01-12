/**
 * Check if route is an auth page
 */

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

const PUBLIC_API_ROUTES = ["/api/sign-in", "/api/sign-up", "/api/seed"];

function isPublicApiRoute(pathname: string) {
  return PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if route needs authentication
 */

const PRIVATE_ROUTES = ["/profile", "/recipes", "/chat"];

function isPrivateRoute(pathname: string) {
  return PRIVATE_ROUTES.some((route) => pathname.startsWith(route));
}

const PRIVATE_API_ROUTES = [
  "/api/chat",
  "/api/comments",
  "/api/recipes",
  "/api/user",
  "/api/profile",
  "/api/sign-out",
];

function isPrivateApiRoute(pathname: string) {
  return PRIVATE_API_ROUTES.some((route) => pathname.startsWith(route));
}

export { isPublicRoute, isPublicApiRoute, isPrivateRoute, isPrivateApiRoute };
