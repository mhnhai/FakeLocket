import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as TenantModel from "../models/tenant.model";

export const createTenantValidation = [
  body("name").notEmpty().withMessage("Tên công ty là bắt buộc"),
  body("otp").isLength({ min: 6, max: 6}).withMessage("OTP phải có độ dài từ 6-10 ký tự"),
];

export const updateTenantValidation = [
  body("name").optional().notEmpty().withMessage("Tên công ty không được để trống"),
  body("otp").optional().isLength({ min: 6, max: 10 }).withMessage("OTP phải có độ dài từ 6-10 ký tự"),
];

export const createTenant = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors.array(),
      });
    }

    const { name, otp } = req.body;

    // Check if OTP already exists
    const existingTenant = await TenantModel.getTenantByOtp(otp);
    if (existingTenant) {
      return res.status(400).json({
        success: false,
        message: "OTP đã tồn tại, vui lòng chọn OTP khác",
      });
    }

    const tenant = await TenantModel.createTenant({ name, otp });

    res.status(201).json({
      success: true,
      message: "Tạo công ty thành công",
      data: tenant,
    });
  } catch (error) {
    console.error("Error creating tenant:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo công ty",
    });
  }
};

export const updateTenant = async (req: Request, res: Response) => {
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
    const tenant = await TenantModel.updateTenant(Number(id), req.body);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Công ty không tồn tại",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật công ty thành công",
      data: tenant,
    });
  } catch (error) {
    console.error("Error updating tenant:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật công ty",
    });
  }
};

export const regenerateTenantOtp = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tenant = await TenantModel.regenerateTenantOtp(Number(id));

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Công ty không tồn tại",
      });
    }

    res.json({
      success: true,
      message: "Tạo OTP mới thành công",
      data: tenant,
    });
  } catch (error) {
    console.error("Error regenerating OTP:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo OTP mới",
    });
  }
};

export const verifyTenantOtp = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP là bắt buộc",
      });
    }

    const tenant = await TenantModel.getTenantByOtp(otp);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "OTP không tồn tại",
      });
    }

    res.json({
      success: true,
      message: "OTP hợp lệ",
      data: {
        tenant_id: tenant.id,
        tenant_name: tenant.name,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xác thực OTP",
    });
  }
};

export const getTenants = async (req: Request, res: Response) => {
  try {
    const tenants = await TenantModel.getAllTenants();
    res.json({
      success: true,
      data: tenants,
    });
  } catch (error) {
    console.error("Error getting tenants:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách công ty",
    });
  }
};

export const deleteTenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await TenantModel.deleteTenant(Number(id));
    res.json({ success: true, message: "Xóa công ty thành công" });
  } catch (error) {
    console.error("Error deleting tenant:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi xóa công ty" });
  }
};

export const deleteAllTenants = async (req: Request, res: Response) => {
  try {
    await TenantModel.deleteAllTenants();
    res.json({ success: true, message: "Xóa tất cả công ty thành công" });
  } catch (error) {
    console.error("Error deleting all tenants:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi xóa tất cả công ty" });
  }
};