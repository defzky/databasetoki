import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/database';

// Helper to parse query params into filters
function parseFilters(searchParams: URLSearchParams): Record<string, any> {
  const filters: Record<string, any> = {};
  
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith('eq.')) {
      filters[key.slice(3)] = value;
    } else if (key.startsWith('neq.')) {
      // Not equal filter - handled in code
      filters[`__neq_${key.slice(4)}`] = value;
    }
  }
  
  return filters;
}

// GET /api/:project/:table - Select rows
export async function GET(
  request: NextRequest,
  { params }: { params: { project: string; table: string } }
) {
  try {
    const { project, table } = params;
    const filters = parseFilters(request.nextUrl.searchParams);
    
    // Validate API key from header
    const apiKey = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }
    
    const projectData = await db.getProjectByApiKey(apiKey);
    if (!projectData || projectData.id !== project) {
      return NextResponse.json(
        { error: 'Invalid API key or project' },
        { status: 403 }
      );
    }
    
    const rows = await db.select(project, table, filters);
    
    return NextResponse.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Failed to select rows:', error);
    return NextResponse.json(
      { error: 'Failed to select rows' },
      { status: 500 }
    );
  }
}

// POST /api/:project/:table - Insert row
export async function POST(
  request: NextRequest,
  { params }: { params: { project: string; table: string } }
) {
  try {
    const { project, table } = params;
    const body = await request.json();
    
    // Validate API key from header
    const apiKey = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }
    
    const projectData = await db.getProjectByApiKey(apiKey);
    if (!projectData || projectData.id !== project) {
      return NextResponse.json(
        { error: 'Invalid API key or project' },
        { status: 403 }
      );
    }
    
    const newRow = await db.insert(project, table, body);
    
    return NextResponse.json({
      success: true,
      data: newRow
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to insert row:', error);
    return NextResponse.json(
      { error: 'Failed to insert row' },
      { status: 500 }
    );
  }
}
