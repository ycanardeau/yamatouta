import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe<T> implements PipeTransform {
	constructor(private readonly schema: ObjectSchema<T>) {}

	transform(value: any): T {
		const result = this.schema.validate(value, { convert: true });

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		return result.value;
	}
}
