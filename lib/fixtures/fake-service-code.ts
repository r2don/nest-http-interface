export const returnStringServiceCode = /* language=typescript */ `
import { HttpInterface, GetExchange } from '@r2don/nest-http-interface';

@HttpInterface()
class TextService {
  constructor() {}

  @GetExchange()
  async getText(): Promise<string> {
    return 'text';
  }
}`;

export const hasResponseBodyServiceCode = /* language=typescript */ `
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

export const notPromiseServiceCode = /* language=typescript */ `
import { HttpInterface, GetExchange, ResponseBody } from '@r2don/nest-http-interface';

@HttpInterface()
class UserService {
  @GetExchange()
  getUser(): string {
    throw new Error('not implemented');
  }
}`;

export const needResponseBodyServiceCode = /* language=typescript */ `
import { HttpInterface, GraphQLExchange, ObservableResponse } from '@r2don/nest-http-interface';
import { Observable } from "rxjs";

class ResponseClass {}

@HttpInterface()
class UserService {
  @GraphQLExchange()
  async getUser(): Promise<ResponseClass> {
    throw new Error('not implemented');
  }

  @GraphQLExchange()
  @ObservableResponse()
  getUserObservable(): Observable<ResponseClass> {
    throw new Error('not implemented');
  }
}`;

export const arrayResponseBodyServiceCode = /* language=typescript */ `
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
