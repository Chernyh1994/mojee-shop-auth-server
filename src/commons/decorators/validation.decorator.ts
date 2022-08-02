import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { HttpStatusCode } from '../enums/http-startus-code.enum';

function validationFactory<T>(metadataKey: symbol, model: { new (...args: any[]): T }, source: 'body') {
  return function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
    Reflect.defineMetadata(metadataKey, model, target, propertyName);

    const method = descriptor.value;

    descriptor.value = async function () {
      const model = Reflect.getOwnMetadata(metadataKey, target, propertyName);
      const [req, res] = arguments;
      const plain = req[source];
      const errors = await validate(plainToClass(model, plain));

      if (errors.length > 0) {
        res.status(HttpStatusCode.BAD_REQUEST).json(transformValidationErrorsToJSON(errors));

        return;
      }

      return method.apply(this, arguments);
    };
  };
}

function transformValidationErrorsToJSON(errors: ValidationError[]) {
  return errors.reduce((p, c: ValidationError) => {
    if (!c.children || !c.children.length) {
      p[c.property] = Object.keys(c.constraints).map((key) => c.constraints[key]);
    } else {
      p[c.property] = transformValidationErrorsToJSON(c.children);
    }
    return p;
  }, {});
}

export const ValidationBody = (request) => validationFactory(Symbol('validate-body'), request, 'body');
