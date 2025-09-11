import express from "express";
import {
  createTenant,
  createTenantValidation,
  updateTenant,
  updateTenantValidation,
  regenerateTenantOtp,
  verifyTenantOtp,
  getTenants,
  deleteTenant,
  deleteAllTenants,
  getTenantNameById,
  getTenantById,
} from "../controllers/tenant.controller";

const router = express.Router();

// Create new tenant
router.post("/create", createTenantValidation, createTenant);

// Update tenant
router.put("/:id", updateTenantValidation, updateTenant);

// Regenerate tenant OTP
router.post("/:id/regenerate-otp", regenerateTenantOtp);

// Verify tenant OTP
router.post("/verify-otp", verifyTenantOtp);

// Get all tenants
router.get("/", getTenants);

// get tenant by id
router.get("/:id", getTenantById);

// Get tenant name by id
router.get("/:id/name", getTenantNameById);

// Delete tenant
router.delete("/:id", deleteTenant);

// Delete all tenants
router.delete("/", deleteAllTenants);
export default router;


