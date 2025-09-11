import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as TeamModel from "../models/team.model";
import * as TenantModel from "../models/tenant.model";

export const createTeamValidation = [
  body("name").notEmpty().withMessage("Tên phòng ban là bắt buộc"),
  body("tenant_id").isInt({ min: 1 }).withMessage("ID công ty không hợp lệ"),
];

export const updateTeamValidation = [
  body("name").notEmpty().withMessage("Tên phòng ban là bắt buộc"),
];

export const createTeam = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors.array(),
      });
    }

    const { name, tenant_id } = req.body;

    // Check if tenant exists
    const tenant = await TenantModel.getTenantById(tenant_id);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Công ty không tồn tại",
      });
    }

    const team = await TeamModel.createTeam({ name, tenant_id });

    res.status(201).json({
      success: true,
      message: "Tạo phòng ban thành công",
      data: team,
    });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo phòng ban",
    });
  }
};

export const getTeamsByTenant = async (req: Request, res: Response) => {
  try {
    const { tenant_id } = req.params;

    if (!tenant_id || isNaN(Number(tenant_id))) {
      return res.status(400).json({
        success: false,
        message: "ID công ty không hợp lệ",
      });
    }

    const teams = await TeamModel.getTeamsByTenantId(Number(tenant_id));

    res.json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error("Error getting teams:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách phòng ban",
    });
  }
};

export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const teams = await TeamModel.getAllTeams();
    res.json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error("Error getting all teams:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách phòng ban",
    });
  }
};

export const getTeamNameById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const team = await TeamModel.getTeamNameById(Number(id));
    res.json({ success: true, data: team });
  } catch (error) {
    console.error("Error getting team name:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tên phòng ban",
    });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const team = await TeamModel.updateTeam(Number(id), req.body);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Phòng ban không tồn tại",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật phòng ban thành công",
      data: team,
    });
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật phòng ban",
    });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await TeamModel.deleteTeam(Number(id));
    res.json({ success: true, message: "Xóa phòng ban thành công" });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi xóa phòng ban" });
  }
};

export const deleteAllTeams = async (req: Request, res: Response) => {
  try {
    await TeamModel.deleteAllTeams();
    res.json({ success: true, message: "Xóa tất cả phòng ban thành công" });
  } catch (error) {
    console.error("Error deleting all teams:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi xóa tất cả phòng ban" });
  }
};
