import { IJwtPayload } from '../../interfaces/helpers/ijwt.payload';

export abstract class JwtPayload implements IJwtPayload {
  sub: string;
  username: string;

  static tokenPayload(params: { id: string; username: string }) {
    return {
      sub: params.id,
      username: params.username,
    };
  }
}
