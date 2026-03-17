import { isConstructor } from '@produck/is-constructor';
import { ThrowTypeError } from '@produck/type-error';

export function SubConstructor(base) {
	if (!isConstructor(base)) {
		ThrowTypeError('args[0]', 'constructor');
	}

	return function parseSubConstructor(value) {
		if (!isConstructor(value) || !(value.prototype instanceof base)) {
			ThrowTypeError('member', base.name);
		}

		return value;
	};
}
