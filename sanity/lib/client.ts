import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, useCdn } from "./config";

export const client = createClient({
  projectId: projectId || "missing-project-id",
  dataset: dataset || "missing-dataset",
  apiVersion,
  useCdn,
  perspective: "published",
});
