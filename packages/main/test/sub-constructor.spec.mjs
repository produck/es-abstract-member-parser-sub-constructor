import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SubConstructor } from '../src/index.mjs';

describe('::SubConstructor()', () => {
	it('should throw if base is not a constructor.', () => {
		for (const sample of [
			() => {},
			async () => {},
			async function() {},
			function*() {},
			1,
			'string',
			null,
			undefined,
			{},
			true,
		]) {
			assert.throws(() => SubConstructor(sample), {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "constructor" expected.',
			});
		}
	});

	it('should return a parser function.', () => {
		class Base {}

		assert.ok(typeof SubConstructor(Base) === 'function');
	});

	describe('parser()', () => {
		class Base {}
		class Child extends Base {}
		class GrandChild extends Child {}

		it('should pass for a direct sub-constructor.', () => {
			assert.equal(SubConstructor(Base)(Child), Child);
		});

		it('should pass for an indirect sub-constructor.', () => {
			assert.equal(SubConstructor(Base)(GrandChild), GrandChild);
		});

		it('should pass for built-in inheritance (Array extends Object).', () => {
			assert.equal(SubConstructor(Object)(Array), Array);
		});

		it('should throw if value is the same as base.', () => {
			assert.throws(() => SubConstructor(Base)(Base), {
				name: 'TypeError',
				message: 'Invalid "member", one "Base" expected.',
			});
		});

		it('should throw if value is not a sub-constructor.', () => {
			class Other {}

			assert.throws(() => SubConstructor(Base)(Other), {
				name: 'TypeError',
				message: 'Invalid "member", one "Base" expected.',
			});
		});

		it('should throw if value is not a constructor.', () => {
			for (const sample of [
				1,
				'string',
				null,
				undefined,
				{},
				true,
				() => {},
				async () => {},
			]) {
				assert.throws(() => SubConstructor(Base)(sample), {
					name: 'TypeError',
					message: 'Invalid "member", one "Base" expected.',
				});
			}
		});

		it('should throw if value is the base of another constructor.', () => {
			assert.throws(() => SubConstructor(Child)(Base), {
				name: 'TypeError',
				message: 'Invalid "member", one "Child" expected.',
			});
		});
	});
});
