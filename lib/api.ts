import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export const handleApiError = (error: unknown) => {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        fields: error.errors.map((issue) => ({ field: issue.path.join('.'), message: issue.message }))
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
};
