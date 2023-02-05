import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '../../core/interfaces/helpers/ijwt.payload';
import { UsersService } from '../../users/users.service';
import { User } from '../../core/models/entities/User';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(ConfigService)
    protected configService: ConfigService,
    @Inject(UsersService)
    protected usersService: UsersService,
  ) {
    const secretKey = configService.get<string>('SECRET_KEY');
    const superOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    };
    super(superOptions);
  }

  async validate(payload: IJwtPayload): Promise<User | null> {
    const user = this.usersService.findByUniqueValue({
      id: payload.sub,
      username: payload.username,
    });
    if (user) return user;
    return null;
  }
}
