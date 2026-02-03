import { QueryFailedError } from 'typeorm';

export function isPostgresUniqueError(error: unknown): boolean {
  return error instanceof QueryFailedError && (error as any).code === '23505';
}
