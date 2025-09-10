import pool from "../config/db";
import bcrypt from "bcryptjs";

export interface User {
  id: number;
  fullname: string;
  email: string;
  password: string;
  tenant_id: number;
  team_id: number;
  role: 'admin' | 'user';
  created_at: Date;
}

export interface CreateUserInput {
  fullname: string;
  email: string;
  password: string;
  tenant_id: number;
  team_id: number;
  role?: 'admin' | 'user';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  fullname: string;
  email: string;
  password: string;
  tenant_id: number;
  team_id: number;
  role: 'admin' | 'user';
}

export const createUser = async (userData: CreateUserInput): Promise<User> => {
  const { fullname, email, password, tenant_id, team_id, role = 'user' } = userData;
  
  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const result = await pool.query(
    `INSERT INTO users (fullname, email, password, tenant_id, team_id, role, created_at) 
     VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
    [fullname, email, hashedPassword, tenant_id, team_id, role]
  );
  
  return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
};

export const getUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const validatePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const getUsers = async (): Promise<User[]> => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

export const getUsersByTenantId = async (tenant_id: number): Promise<User[]> => {
  const result = await pool.query("SELECT * FROM users WHERE tenant_id = $1", [tenant_id]);
  return result.rows;
};

export const deleteUser = async (id: number): Promise<void> => {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
};

export const deleteAllUsers = async (): Promise<void> => {
  await pool.query("DELETE FROM users");
};

export const updateUser = async (id: number, userData: UpdateUserInput): Promise<void> => {
  const { fullname, email, password, tenant_id, team_id, role } = userData;
  await pool.query("UPDATE users SET fullname = $1, email = $2, password = $3, tenant_id = $4, team_id = $5, role = $6 WHERE id = $7", [fullname, email, password, tenant_id, team_id, role, id]);
};