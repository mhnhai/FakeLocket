import pool from "../config/db";

export interface Team {
  id: number;
  name: string;
  tenant_id: number;
  created_at: Date;
}

export interface CreateTeamInput {
  name: string;
  tenant_id: number;
}

export interface UpdateTeamInput {
  name: string;
}

export const createTeam = async (teamData: CreateTeamInput): Promise<Team> => {
  const { name, tenant_id } = teamData;
  const result = await pool.query(
    "INSERT INTO teams (name, tenant_id, created_at) VALUES ($1, $2, NOW()) RETURNING *",
    [name, tenant_id]
  );
  return result.rows[0];
};

export const getTeamById = async (id: number): Promise<Team | null> => {
  const result = await pool.query("SELECT * FROM teams WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const getTeamsByTenantId = async (tenant_id: number): Promise<Team[]> => {
  const result = await pool.query(
    "SELECT * FROM teams WHERE tenant_id = $1 ORDER BY created_at DESC",
    [tenant_id]
  );
  return result.rows;
};

export const getAllTeams = async (): Promise<Team[]> => {
  const result = await pool.query("SELECT * FROM teams ORDER BY created_at DESC");
  return result.rows;
};

export const updateTeam = async (id: number, teamData: UpdateTeamInput): Promise<Team | null> => {
  const { name } = teamData;
  const result = await pool.query(
    "UPDATE teams SET name = $1 WHERE id = $2 RETURNING *",
    [name, id]
  );
  return result.rows[0] || null;
};

export const deleteTeam = async (id: number): Promise<void> => {
  await pool.query("DELETE FROM teams WHERE id = $1", [id]);
};

export const deleteAllTeams = async (): Promise<void> => {
  await pool.query("DELETE FROM teams");
};
