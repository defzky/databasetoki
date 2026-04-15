/**
 * DatabaseToki - JSON Database Operations
 * Handles multi-tenant JSON storage with isolation
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATABASES_DIR = join(process.cwd(), 'databases');

// Ensure databases directory exists
async function ensureDatabaseDir(projectId: string) {
  const projectDir = join(DATABASES_DIR, projectId);
  await fs.mkdir(projectDir, { recursive: true });
  return projectDir;
}

// Get table file path
function getTablePath(projectId: string, table: string) {
  return join(DATABASES_DIR, projectId, `${table}.json`);
}

// Read JSON file
async function readJSON(filePath: string): Promise<any[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    // File doesn't exist, return empty array
    return [];
  }
}

// Write JSON file
async function writeJSON(filePath: string, data: any[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Project Management
export async function createProject(name: string, description: string = '') {
  const projectId = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${uuidv4().slice(0, 8)}`;
  const apiKey = `dbtoki_live_${uuidv4().replace(/-/g, '')}`;
  
  await ensureDatabaseDir(projectId);
  
  // Create project metadata
  const metadata = {
    id: projectId,
    name,
    description,
    apiKey,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tables: []
  };
  
  await writeJSON(getTablePath(projectId, '_metadata'), [metadata]);
  
  return metadata;
}

export async function getProject(projectId: string) {
  const metadata = await readJSON(getTablePath(projectId, '_metadata'));
  return metadata[0] || null;
}

export async function listProjects() {
  const entries = await fs.readdir(DATABASES_DIR, { withFileTypes: true });
  const projects = [];
  
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      const project = await getProject(entry.name);
      if (project) {
        projects.push(project);
      }
    }
  }
  
  return projects;
}

export async function deleteProject(projectId: string) {
  const projectDir = join(DATABASES_DIR, projectId);
  await fs.rm(projectDir, { recursive: true, force: true });
  return true;
}

// Table Operations
export async function insert(projectId: string, table: string, data: any) {
  await ensureDatabaseDir(projectId);
  
  const filePath = getTablePath(projectId, table);
  const rows = await readJSON(filePath);
  
  const newRow = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data
  };
  
  rows.push(newRow);
  await writeJSON(filePath, rows);
  
  return newRow;
}

export async function select(
  projectId: string,
  table: string,
  filters: Record<string, any> = {}
) {
  const filePath = getTablePath(projectId, table);
  const rows = await readJSON(filePath);
  
  // Apply filters
  if (Object.keys(filters).length === 0) {
    return rows;
  }
  
  return rows.filter(row => {
    for (const [key, value] of Object.entries(filters)) {
      if (row[key] !== value) {
        return false;
      }
    }
    return true;
  });
}

export async function update(
  projectId: string,
  table: string,
  id: string,
  data: any
) {
  const filePath = getTablePath(projectId, table);
  const rows = await readJSON(filePath);
  
  const index = rows.findIndex(row => row.id === id);
  if (index === -1) {
    return null;
  }
  
  rows[index] = {
    ...rows[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  await writeJSON(filePath, rows);
  
  return rows[index];
}

export async function remove(projectId: string, table: string, id: string) {
  const filePath = getTablePath(projectId, table);
  const rows = await readJSON(filePath);
  
  const index = rows.findIndex(row => row.id === id);
  if (index === -1) {
    return false;
  }
  
  rows.splice(index, 1);
  await writeJSON(filePath, rows);
  
  return true;
}

// API Key Validation
export async function validateApiKey(apiKey: string): Promise<boolean> {
  const projects = await listProjects();
  return projects.some(p => p.apiKey === apiKey);
}

export async function getProjectByApiKey(apiKey: string) {
  const projects = await listProjects();
  return projects.find(p => p.apiKey === apiKey);
}
