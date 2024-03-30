import _ from "lodash";
import { ExtractJwt, Strategy } from "passport-jwt";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { UserService } from "src/user/users.service";
import { Request as RequestType } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_ACCESS_TOKEN_SECRET"),
    });
  }
  private static extractJWT(req: RequestType): string | null {
    const { authorization } = req.cookies;
    console.log(authorization);
    if (authorization) {
      const [tokenType, token] = authorization.split(" ");
      if (tokenType !== "Bearer")
        throw new BadRequestException("토큰 타입이 일치하지 않습니다.");
      if (token) {
        console.log(1, token);
        return token;
      }
      return null;
    }
  }

  async validate(payload: any) {
    console.log(2, payload.email);
    const user = await this.userService.findByEmail(payload.email);
    console.log(user);
    if (_.isNil(user)) {
      throw new NotFoundException("해당하는 사용자를 찾을 수 없습니다.");
    }

    return user;
  }
}
