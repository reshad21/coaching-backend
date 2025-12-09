import {
  createSiteSettingController,
  deleteSiteSettingController,
  getAllSiteSettingController,
  getSiteSettingControllerById,
  updateSiteSettingController,
} from "@/controllers/siteSettingController/siteSettingController";
import { Router } from "express";

const siteSettingRouts = Router();

siteSettingRouts.post("/", createSiteSettingController);
siteSettingRouts.get("/", getAllSiteSettingController);
siteSettingRouts.get("/:id", getSiteSettingControllerById);
siteSettingRouts.patch("/:id", updateSiteSettingController);
siteSettingRouts.delete("/:id", deleteSiteSettingController);

export default siteSettingRouts;
