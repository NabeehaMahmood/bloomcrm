import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';

export async function validateBody(
  req: NextRequest,
  schema: ZodSchema
): Promise<{ valid: boolean; data?: any; error?: NextResponse }> {
  try {
    const body = await req.json();
    const validatedData = await schema.parseAsync(body);
    return { valid: true, data: validatedData };
  } catch (error: any) {
    const errorMessage = error.errors?.[0]?.message || 'Validation failed';
    return {
      valid: false,
      error: NextResponse.json({ error: errorMessage }, { status: 400 }),
    };
  }
}

export async function validateQuery(
  req: NextRequest,
  schema: ZodSchema
): Promise<{ valid: boolean; data?: any; error?: NextResponse }> {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const validatedData = await schema.parseAsync(params);
    return { valid: true, data: validatedData };
  } catch (error: any) {
    const errorMessage = error.errors?.[0]?.message || 'Validation failed';
    return {
      valid: false,
      error: NextResponse.json({ error: errorMessage }, { status: 400 }),
    };
  }
}
