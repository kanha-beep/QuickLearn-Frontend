import { api } from "../../api";

// Call assign once when a student first enters the feature being compared.
export const assignFeatureVariant = async (featureKey) => {
  const { data } = await api.post("/api/feature-experiments/assign", { featureKey });
  return data;
};

// Call active after a return visit and completed after the measured task finishes.
export const recordFeatureExperimentEvent = (payload) =>
  api.post("/api/feature-experiments/events", payload);
