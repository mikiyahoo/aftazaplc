import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

// GET /api/companies - List all companies
export async function GET(request: NextRequest) {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { properties: true },
        },
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

// POST /api/companies - Create a new company (admin only)
export async function POST(request: NextRequest) {
  // Require admin authentication
  const token = await requireAdminAuth(request);
  if (!token) {
    return unauthorizedResponse();
  }
  
  try {
    const body = await request.json();
    const { name, phone, email } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
