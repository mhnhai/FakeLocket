import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/user.model";
import * as TenantModel from "../models/tenant.model";
import * as TeamModel from "../models/team.model";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const registerValidation = [
  body("fullname").notEmpty().withMessage("Họ tên là bắt buộc"),
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password").isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự"),

  // Validation for creating new tenant
  body("create_tenant").optional().isBoolean(),
  body("tenant_name").if(body("create_tenant").equals("true")).notEmpty().withMessage("Tên công ty là bắt buộc khi tạo công ty mới"),

  // Validation for joining existing tenant (when not creating tenant)
  body("otp").if(body("create_tenant").not().equals("true")).notEmpty().withMessage("OTP là bắt buộc khi tham gia công ty có sẵn"),
  body("team_id").if(body("create_tenant").not().equals("true")).isInt({ min: 1 }).withMessage("ID phòng ban không hợp lệ"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password").notEmpty().withMessage("Mật khẩu là bắt buộc"),
];

export const updateUserValidation = [
  body("fullname").notEmpty().withMessage("Họ tên là bắt buộc"),
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password").isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
  body("tenant_id").isInt({ min: 1 }).withMessage("ID công ty không hợp lệ"),
  body("team_id").isInt({ min: 1 }).withMessage("ID phòng ban không hợp lệ"),
];
export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors.array(),
      });
    }

    const { fullname, email, password, otp, team_id, create_tenant, tenant_name } = req.body;

    // Check if email already exists
    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng",
      });
    }

    let tenant;
    let isAdmin = false;

    // If creating new tenant
    if (create_tenant && tenant_name) {
      // Generate OTP if not provided
      const finalOtp = otp || Math.random().toString(36).substring(2, 8).toUpperCase();

      // Check if OTP already exists
      const existingTenant = await TenantModel.getTenantByOtp(finalOtp);
      if (existingTenant) {
        return res.status(400).json({
          success: false,
          message: "OTP đã tồn tại, vui lòng thử lại",
        });
      }

      // Create new tenant
      tenant = await TenantModel.createTenant({ name: tenant_name, otp: finalOtp });
      isAdmin = true;

      // Create default team for the tenant
      const defaultTeam = await TeamModel.createTeam({
        name: "General",
        tenant_id: tenant.id,
      });

      // Use the default team for the user
      req.body.team_id = defaultTeam.id;
    } else {
      // Verify OTP and get tenant
      if (!otp) {
        return res.status(400).json({
          success: false,
          message: "OTP là bắt buộc",
        });
      }

      tenant = await TenantModel.getTenantByOtp(otp);
      if (!tenant) {
        return res.status(400).json({
          success: false,
          message: "OTP không hợp lệ",
        });
      }

      // Verify team_id is provided
      if (!team_id) {
        return res.status(400).json({
          success: false,
          message: "Phòng ban là bắt buộc",
        });
      }

      // Verify team belongs to tenant
      const team = await TeamModel.getTeamById(team_id);
      if (!team || team.tenant_id !== tenant.id) {
        return res.status(400).json({
          success: false,
          message: "Phòng ban không thuộc về công ty này",
        });
      }
    }

    // Create user
    const user = await UserModel.createUser({
      fullname,
      email,
      password,
      tenant_id: tenant.id,
      team_id: req.body.team_id || team_id,
      role: isAdmin ? "admin" : "user",
    });

    console.log(`User created successfully: ${email} as ${isAdmin ? 'admin' : 'user'} in tenant ${tenant.name}`);

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        tenant_id: user.tenant_id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng ký",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Get user by email
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // Validate password
    const isValidPassword = await UserModel.validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        tenant_id: user.tenant_id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng nhập",
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.getUsers();
    // Remove passwords from response
    const usersResponse = users.map(({ password, ...user }) => user);
    
    res.json({
      success: true,
      data: usersResponse,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách người dùng",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await UserModel.deleteUser(Number(id));
    res.json({ success: true, message: "Xóa người dùng thành công" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi xóa người dùng" });
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    await UserModel.deleteAllUsers();
    res.json({ success: true, message: "Xóa tất cả người dùng thành công" });
  } catch (error) {
    console.error("Error deleting all users:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi xóa tất cả người dùng" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await UserModel.updateUser(Number(id), req.body);
    res.json({ success: true, message: "Cập nhật người dùng thành công" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi cập nhật người dùng" });
  }
};