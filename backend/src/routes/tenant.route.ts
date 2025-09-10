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

// Delete tenant
router.delete("/:id", deleteTenant);

// Delete all tenants
router.delete("/", deleteAllTenants);
export default router;


