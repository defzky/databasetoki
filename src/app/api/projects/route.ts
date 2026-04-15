import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/database';

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }
    
    const project = await db.createProject(name, description || '');
    
    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        apiKey: project.apiKey,
        createdAt: project.createdAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// GET /api/projects - List all projects
export async function GET() {
  try {
    const projects = await db.listProjects();
    
    // Don't expose API keys in list
    const safeProjects = projects.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      projects: safeProjects,
      count: safeProjects.length
    });
  } catch (error) {
    console.error('Failed to list projects:', error);
    return NextResponse.json(
      { error: 'Failed to list projects' },
      { status: 500 }
    );
  }
}
