import { Router } from "express";
import { abacusLevels, vedicModules } from "../services/courseConfig.js";

type RouterFactory = () => ReturnType<typeof Router>;

export function createCourseRoutes(makeRouter: RouterFactory = () => Router()) {
  const router = makeRouter();

  router.get("/", (_req, res) => {
    return res.json({
      abacus: { levels: abacusLevels },
      vedic: { modules: vedicModules }
    });
  });

  return router;
}

export default createCourseRoutes;
