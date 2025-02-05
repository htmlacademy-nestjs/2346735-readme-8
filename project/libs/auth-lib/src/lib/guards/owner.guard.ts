import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ForbiddenException('Invalid token');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decoded: any;
    try {
      decoded = this.jwtService.decode(token);
    } catch (err: unknown) {
      throw new ForbiddenException('Invalid token');
    }

    if (!decoded || !decoded.userId) {
      throw new ForbiddenException('Invalid user token');
    }

    const resourceOwnerId = this.getResourceOwnerId(request);

    if (!resourceOwnerId || resourceOwnerId !== decoded.userId) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }

  private getResourceOwnerId(request: Request): string | null {
    if (request.body?.userId) {
      return request.body.userId;
    }
    if (request.params?.userId) {
      return request.params.userId;
    }
    return null;
  }
}
