import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.problem || !body.cause || !body.solution) {
      return NextResponse.json(
        { error: 'Missing required framework fields' },
        { status: 400 }
      )
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    const { data, error } = await supabaseAdmin
      .from('insights')
      .insert([
        {
          slug,
          title: body.title,
          silo: body.silo,
          problem_statement: body.problem,
          systemic_cause: body.cause,
          structural_solution: body.solution,
          cta_link: body.cta || '/developer-commercialization',
          published_date: new Date().toISOString().split('T')[0],
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json({
      message: 'Protocol published successfully',
      slug: data[0].slug,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}