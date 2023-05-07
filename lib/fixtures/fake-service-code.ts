export const returnStringServiceCode = `
import { HttpInterface, GetExchange } from '@r2don/nest-http-interface';

@HttpInterface()
class TextService {
  constructor() {}

  @GetExchange()
  async getText(): Promise<string> {
    return 'text';
  }
}`;

export const hasResponseBodyServiceCode = `
import { HttpInterface, PostExchange, ResponseBody } from '@r2don/nest-http-interface';
import { User } from './user.entity';

@HttpInterface()
class UserService {
  @PostExchange()
  @ResponseBody(User)
  async getUser(): Promise<any> {
    throw new Error('not implemented');
  }
}`;

export const notPromiseServiceCode = `
import { HttpInterface, GetExchange, ResponseBody } from '@r2don/nest-http-interface';

@HttpInterface()
class UserService {
  @GetExchange()
  getUser(): string {
    throw new Error('not implemented');
  }
}`;

export const needResponseBodyServiceCode = `
import { HttpInterface, GraphQLExchange } from '@r2don/nest-http-interface';

class ResponseClass {}

@HttpInterface()
class UserService {
  @GraphQLExchange()
  async getUser(): Promise<ResponseClass> {
    throw new Error('not implemented');
  }
}`;

export const arrayResponseBodyServiceCode = `
import { HttpInterface, GetExchange } from '@r2don/nest-http-interface';

class ResponseClass {}

@HttpInterface()
class UserService {
  @GetExchange()
  async getUsers(): Promise<ResponseClass[]> {
    throw new Error('not implemented');
  }

  @GetExchange()
  async getUserList(): Promise<Array<ResponseClass>> {
    throw new Error('not implemented');
  }

  @GetExchange()
  async getUsersReadonly(): Promise<readonly ResponseClass[]> {
    throw new Error('not implemented');
  }
}`;
