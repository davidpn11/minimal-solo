import * as io from "io-ts";
import * as Either from "fp-ts/lib/Either";
import { isSome } from "fp-ts/lib/Option";
import { formatValidationError } from "io-ts-reporters";

export function formatErrors(errors: io.Errors) {
  return errors
    .map((value) => formatValidationError(value))
    .filter(isSome)
    .map((opt) => opt.value)
    .join("\n");
}

export function runTypeDecoder<T extends io.Props>(type: io.TypeC<T>) {
  return (data: unknown) => {
    const result = type.decode(data);
    if (Either.isLeft(result)) {
      throw new Error(`Failed to decode type.\n${formatErrors(result.left)}`);
    }
    return result.right;
  };
}
