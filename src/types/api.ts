export interface ZodError {
  name: 'ZodError';
  errors: Array<{
    message: string;
    path: (string | number)[];
    code: string;
  }>;
}

export function isZodError(error: unknown): error is ZodError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'name' in error &&
    error.name === 'ZodError' &&
    'errors' in error
  );
}