import { isConstructor } from '@produck/is-constructor';
import { isSubConstructor } from '@produck/is-sub-constructor';
import { ThrowTypeError } from '@produck/type-error';

export function SubConstructor(base) {
	if (!isConstructor(base)) {
		ThrowTypeError('args[0] as base', 'constructor');
	}

	return function parseSubConstructor(value) {
		if (!isSubConstructor(value, base)) {
			ThrowTypeError('member', `SubConstructor of ${base.name}`);
		}

		return value;
	};
}
