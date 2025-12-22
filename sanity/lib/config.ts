const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "";
const apiVersion = process.env.SANITY_API_VERSION || "2024-02-01";

export const hasValidConfig = Boolean(projectId && dataset);
export { projectId, dataset, apiVersion };
export const useCdn = process.env.NODE_ENV === "production";
