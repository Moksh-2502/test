import { api } from "./client";
import type { CourseItem } from "../types";

export const coursesApi = {
  all: () => api<{ abacus: { levels: CourseItem[] }; vedic: { modules: CourseItem[] } }>("/api/courses")
};
