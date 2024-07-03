import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'];

    // Replace 'your-api-key' with your actual API key or a validation logic
    if (apiKey && apiKey === 'kgddmhqfzrzselrrrjvpmgdrhgsrophl') {
      return true;
    } else {
      throw new UnauthorizedException('Invalid API key');
    }
  }
}
