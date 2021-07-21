import { HttpResponse, HttpRequest } from "../protocols/http";

import { MissingParamError } from "../errors/missing-param-error";

import { badRequest } from "../helpers/http-helpers";

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredField = ["name", "email", "password"];
    for (const field of requiredField) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    return {
      statusCode: 400,
      body: new Error(""),
    };
  }
}
