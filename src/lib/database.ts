/**
 * DatabaseToki - JSON Database Operations with Vercel Blob Storage
 * Handles multi-tenant JSON storage with isolation
 */

import { v4 as uuidv4 } from 'uuid';
import { get } from '@vercel/blob';

// Storage prefix for each project
function getProjectStoragePrefix(projectId: string): string {
  return `databases/${projectId}/`;
}

// Get full blob path
function getBlobPath(projectId: string, table: string): string {
  return `${getProjectStoragePrefix(projectId)}${table}.json`;
}

// Read data from blob storage
async function readBlob(projectId: string, table: string): Promise<any[]> {
  const blobPath = getBlobPath(projectId, table);
  
  try {
    const blob = await get(blobPath);
    if (!blob || !blob.url) {
      return [];
    }
    
    // Fetch the blob content
    const response = await fetch(blob.url);
    const content = await response.text();
    return JSON.parse(content);
  } catch (error) {
    // Blob doesn't exist, return empty array
    return [];
  }
}

// Write data to blob storage
async function writeBlob(projectId: string, table: string, data: any[]): Promise<void> {
  const blobPath = getBlobPath(projectId, table);
  
  // In production, use process.env.VERCEL_BLOB_READ_WRITE_TOKEN
  // For now, we'll use a fallback mechanism
  if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
    console.warn('VERCEL_BLOB_READ_WRITE_TOKEN not set, using fallback');
    return;
  }
  
  // TODO: Implement actual blob upload using @vercel/blob
  // This requires Vercel Blob to be properly configured
}

// In-memory fallback for development (without Vercel Blob)
const memoryStorage: Record<string, any[]> = {};

export async function readJSON(projectId: string, table: string): Promise<any[]> {
  // Try Vercel Blob first (production)
  const blobData = await readBlob(projectId, table);
  if (blobData.length > 0) {
    return blobData;
  }
  
  // Fallback to in-memory storage (development only)
  const key = `${projectId}:${table}`;
  return memoryStorage[key] || [];
}

export async function writeJSON(projectId: string, table: string, data: any[]): Promise<void> {
  const blobPath = getBlobPath(projectId, table);
  
  // In production, use Vercel Blob
  if (process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
    await writeBlob(projectId, table, data);
    return;
  }
  
  // Fallback to in-memory storage (development only)
  const key = `${projectId}:${table}`;
  memoryStorage[key] = data;
}

// Project Management
export async function createProject(name: string, description: string = '') {
  const projectId = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${uuidv4().slice(0, 8)}`;
  const apiKey = `dbtoki_live_${uuidv4().replace(/-/g, '')}`;
  
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
  
  await writeJSON(projectId, '_metadata', [metadata]);
  
  // Store in memory for immediate access
  memoryStorage[`${projectId}:_metadata`] = [metadata];
  
  return metadata;
}

export async function getProject(projectId: string) {
  const metadata = await readJSON(projectId, '_metadata');
  return metadata[0] || null;
}

export async function listProjects() {
  const entries = Object.entries(memoryStorage);
  const projects: any[] = [];
  
  for (const [key, data] of entries) {
    if (key.endsWith(':_metadata')) {
      projects.push(data[0]);
    }
  }
  
  return projects;
}

export async function deleteProject(projectId: string) {
  // Delete metadata
  await writeJSON(projectId, '_metadata', []);
  
  // Remove from memory
  const keysToRemove = Object.keys(memoryStorage).filter(key => 
    key.startsWith(`${projectId}:`)
  );
  keysToRemove.forEach(key => {
    delete memoryStorage[key];
  });
  
  return true;
}

// Table Operations
export async function insert(projectId: string, table: string, data: any) {
  const rows = await readJSON(projectId, table);
  
  const newRow = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data
  };
  
  rows.push(newRow);
  await writeJSON(projectId, table, rows);
  
  return newRow;
}

export async function select(
  projectId: string,
  table: string,
  filters: Record<string, any> = {}
) {
  const rows = await readJSON(projectId, table);
  
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
  const rows = await readJSON(projectId, table);
  
  const index = rows.findIndex(row => row.id === id);
  if (index === -1) {
    return null;
  }
  
  rows[index] = {
    ...rows[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  await writeJSON(projectId, table, rows);
  
  return rows[index];
}

export async function remove(projectId: string, table: string, id: string) {
  const rows = await readJSON(projectId, table);
  
  const index = rows.findIndex(row => row.id === id);
  if (index === -1) {
    return false;
  }
  
  rows.splice(index, 1);
  await writeJSON(projectId, table, rows);
  
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
