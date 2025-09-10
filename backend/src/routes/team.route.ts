import express from "express";
import {
  createTeam,
  createTeamValidation,
  updateTeam,
  updateTeamValidation,
  getTeamsByTenant,
  getAllTeams,
  deleteTeam,
  deleteAllTeams,
} from "../controllers/team.controller";

const router = express.Router();

// Create new team
router.post("/create", createTeamValidation, createTeam);

// Update team
router.put("/:id", updateTeamValidation, updateTeam);

// Get teams by tenant ID
router.get("/tenant/:tenant_id", getTeamsByTenant);

// Get all teams
router.get("/", getAllTeams);

// Delete team
router.delete("/:id", deleteTeam);

// Delete all teams
router.delete("/", deleteAllTeams);

export default router;
