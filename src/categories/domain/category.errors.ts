import { ExceptionBase } from 'src/common/exceptions/exception.base';

export class CategoryNotFoundException extends ExceptionBase {
  static readonly message = 'Category not found';
  public readonly code = 'CATEGORY.NOT_FOUND';

  constructor(cause?: Error) {
    super(CategoryNotFoundException.message, cause)
  }
}
