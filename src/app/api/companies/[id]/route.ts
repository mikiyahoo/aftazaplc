import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

// GET /api/companies/[id] - Get a single company (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: { properties: true },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}

// PUT /api/companies/[id] - Update a company (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require admin authentication
  const token = await requireAdminAuth(request);
  if (!token) {
    return unauthorizedResponse();
  }
  
  try {
    const { id } = params;
    const body = await request.json();
    const { name, phone, email } = body;

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}

// DELETE /api/companies/[id] - Delete a company (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require admin authentication
  const token = await requireAdminAuth(request);
  if (!token) {
    return unauthorizedResponse();
  }
  
  try {
    const { id } = params;

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Check if company has properties
    const propertyCount = await prisma.property.count({
      where: { companyId: id },
    });

    if (propertyCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete company with associated properties. Please reassign or delete properties first.' },
        { status: 400 }
      );
    }

    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
}