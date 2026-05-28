import { Router } from "express";
import { abacusLevels, vedicModules } from "../services/courseConfig.js";

const router = Router();

router.get("/", (_req, res) => {
  return res.json({
    abacus: { levels: abacusLevels },
    vedic: { modules: vedicModules }
  });
});

export { router as courseRoutes };
export default router;
