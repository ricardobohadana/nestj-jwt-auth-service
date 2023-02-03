import {
  ExtractJwt,
  Strategy,
  StrategyOptions,
  VerifiedCallback,
} from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { IJwtPayload } from '../../core/interfaces/helpers/ijwt.payload';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(ConfigService)
    protected configService: ConfigService,
    @Inject(AuthService)
    protected authService: AuthService,
  ) {
    const secretKey = configService.get<string>('SECRET_KEY');
    const superOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJwtStrategy.ExtractJwtFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: secretKey,
      passReqToCallback: true,
    };
    super(superOptions);
  }

  async validate(
    request: Request,
    payload: IJwtPayload,
    done: VerifiedCallback,
  ): Promise<{ id: string; username: string }> {
    const refreshToken = RefreshJwtStrategy.ExtractJwtFromCookie(request);

    const isExpired: boolean = await this.authService.isPersistenTokenInvalid(
      refreshToken,
    );

    if (isExpired) done(new UnauthorizedException(), false);
    else
      return {
        id: payload.sub,
        username: payload.username,
      };
  }

  static ExtractJwtFromCookie(request: Request): string | null {
    if (request && request.cookies) {
      const token = request.cookies['token'] as string;
      return token;
    }
    return null;
  }
}
