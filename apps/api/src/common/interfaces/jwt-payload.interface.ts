import { Rol } from '../enums/rol.enum';

/**
 * Estructura del payload firmado en el token JWT.
 * Se inyecta en req.user tras validar el token.
 */
export interface JwtPayload {
  sub: number; // id del usuario
  usuario: string; // nombre de usuario (username)
  rol: Rol;
  unidadId: number | null;
}
