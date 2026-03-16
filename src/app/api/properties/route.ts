import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

// GET /api/properties - List all properties with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');
    const companyId = searchParams.get('companyId');
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};

    if (featured === 'true') {
      where.featured = true;
    }

    if (status) {
      where.status = status;
    }

    if (companyId) {
      where.companyId = companyId;
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
            }
          },
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      properties: properties.map(p => ({
        ...p,
        primaryImage: p.images[0]?.imageUrl || null,
        images: undefined,
      })),
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

// POST /api/properties - Create a new property (admin only)
export async function POST(request: NextRequest) {
  // Require admin authentication
  const token = await requireAdminAuth(request);
  if (!token) {
    return unauthorizedResponse();
  }
  
  try {
    const body = await request.json();
    
    const {
      title,
      slug,
      price,
      location,
      propertyType,
      status,
      bedrooms,
      bathrooms,
      parking,
      area,
      description,
      featured,
      companyId,
      createdBy,
      images,
    } = body;

    // Validate required fields
    if (!title || !slug || !price || !location || !propertyType) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, price, location, propertyType' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProperty = await prisma.property.findUnique({
      where: { slug },
    });

    if (existingProperty) {
      return NextResponse.json(
        { error: 'Property with this slug already exists' },
        { status: 400 }
      );
    }

    // Create property with images
    const property = await prisma.property.create({
      data: {
        title,
        slug,
        price: parseFloat(price),
        location,
        propertyType,
        status: status || 'active',
        bedrooms: (bedrooms || bedrooms === 0) ? parseInt(bedrooms) : null,
        bathrooms: (bathrooms || bathrooms === 0) ? parseInt(bathrooms) : null,
        parking: (parking || parking === 0) ? parseInt(parking) : null,
        area: (area || area === 0) ? parseFloat(area) : null,
        description,
        featured: featured || false,
        companyId: companyId || null,
        createdBy: createdBy || null,
        images: images ? {
          create: images.map((img: any, index: number) => ({
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary || index === 0,
            sortOrder: img.sortOrder || index,
          })),
        } : undefined,
      },
      include: {
        images: true,
        company: true,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
