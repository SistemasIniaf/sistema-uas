import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marca una ruta como pública: el JwtAuthGuard la dejará pasar sin token.
 * @example @Public() @Post('login')
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
