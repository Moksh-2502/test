import { Router } from "express";
import { abacusLevels, vedicModules } from "../services/courseConfig.js";

export function createCourseRoutes() {
  const router = Router();

  router.get("/", (_req, res) => {
    return res.json({
      abacus: { levels: abacusLevels },
      vedic: { modules: vedicModules }
    });
  });

  return router;
}

const router = createCourseRoutes();

export { router as courseRoutes };
export default router;
