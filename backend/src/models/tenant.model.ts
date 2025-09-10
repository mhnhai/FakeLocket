import pool from "../config/db";

export interface Tenant {
  id: number;
  name: string;
  otp: string;
  created_at: Date;
}

export interface CreateTenantInput {
  name: string;
  otp: string;
}

export interface UpdateTenantInput {
  name?: string;
  otp?: string;
}

export const createTenant = async (tenantData: CreateTenantInput): Promise<Tenant> => {
  const { name, otp } = tenantData;
  const result = await pool.query(
    "INSERT INTO tenants (name, otp, created_at) VALUES ($1, $2, NOW()) RETURNING *",
    [name, otp]
  );
  return result.rows[0];
};

export const getTenantByOtp = async (otp: string): Promise<Tenant | null> => {
  const result = await pool.query("SELECT * FROM tenants WHERE otp = $1", [otp]);
  return result.rows[0] || null;
};

export const getTenantById = async (id: number): Promise<Tenant | null> => {
  const result = await pool.query("SELECT * FROM tenants WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const getAllTenants = async (): Promise<Tenant[]> => {
  const result = await pool.query("SELECT * FROM tenants ORDER BY created_at DESC");
  return result.rows;
};

export const updateTenant = async (id: number, tenantData: UpdateTenantInput): Promise<Tenant | null> => {
  const updates = [];
  const values = [];
  let paramIndex = 1;

  if (tenantData.name) {
    updates.push(`name = $${paramIndex++}`);
    values.push(tenantData.name);
  }

  if (tenantData.otp) {
    updates.push(`otp = $${paramIndex++}`);
    values.push(tenantData.otp);
  }

  if (updates.length === 0) {
    return await getTenantById(id);
  }

  values.push(id);
  const result = await pool.query(
    `UPDATE tenants SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return result.rows[0] || null;
};

export const regenerateTenantOtp = async (id: number): Promise<Tenant | null> => {
  // Generate new OTP
  const newOtp = Math.random().toString(36).substring(2, 8).toUpperCase();

  return await updateTenant(id, { otp: newOtp });
};

export const deleteTenant = async (id: number): Promise<void> => {
  await pool.query("DELETE FROM tenants WHERE id = $1", [id]);
};

export const deleteAllTenants = async (): Promise<void> => {
  await pool.query("DELETE FROM tenants");
};
