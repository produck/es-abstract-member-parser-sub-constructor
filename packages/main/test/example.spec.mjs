import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import Abstract, { SubConstructorProxy } from '@produck/es-abstract-token';
import { SubConstructor } from '../src/index.mjs';

describe('Example::SubConstructor with @produck/es-abstract-token', () => {
	describe('as instance member parser', () => {
		class BaseRenderer {
			render() {}
		}

		class CanvasRenderer extends BaseRenderer {
			render() { return 'canvas'; }
		}

		class SVGRenderer extends BaseRenderer {
			render() { return 'svg'; }
		}

		class UnrelatedClass {}

		const AbstractWidget = Abstract(
			class Widget {
				#Renderer;

				constructor(Renderer) {
					this.#Renderer = Renderer;
				}

				createRenderer() {
					return new this.#Renderer();
				}
			},
			Abstract('Renderer', SubConstructor(BaseRenderer)),
		);

		it('should create widget with a valid sub-constructor.', () => {
			class MyWidget extends AbstractWidget {
				get Renderer() { return CanvasRenderer; }
			}

			const widget = new MyWidget(CanvasRenderer);

			assert.equal(widget.Renderer, CanvasRenderer);
		});

		it('should accept another valid sub-constructor.', () => {
			class MyWidget extends AbstractWidget {
				get Renderer() { return SVGRenderer; }
			}

			const widget = new MyWidget(SVGRenderer);

			assert.equal(widget.Renderer, SVGRenderer);
		});

		it('should throw if member is NOT a sub-constructor of BaseRenderer.', () => {
			class MyWidget extends AbstractWidget {
				get Renderer() { return UnrelatedClass; }
			}

			const widget = new MyWidget(CanvasRenderer);

			assert.throws(() => widget.Renderer, {
				name: 'TypeError',
				message: 'Invalid "member", one "BaseRenderer" expected.',
			});
		});

		it('should throw if member is the base itself.', () => {
			class MyWidget extends AbstractWidget {
				get Renderer() { return BaseRenderer; }
			}

			const widget = new MyWidget(CanvasRenderer);

			assert.throws(() => widget.Renderer, {
				name: 'TypeError',
				message: 'Invalid "member", one "BaseRenderer" expected.',
			});
		});
	});

	describe('as static member parser', () => {
		class BaseStrategy {
			execute() {}
		}

		class ConcreteStrategyA extends BaseStrategy {
			execute() { return 'A'; }
		}

		class ConcreteStrategyB extends BaseStrategy {
			execute() { return 'B'; }
		}

		const AbstractProcessor = Abstract(
			class Processor {
				process() {
					const Strategy = this.constructor.Strategy;

					return new Strategy().execute();
				}
			},
			Abstract.Static('Strategy', SubConstructor(BaseStrategy)),
		);

		it('should access valid static sub-constructor.', () => {
			class MyProcessor extends AbstractProcessor {
				static Strategy = ConcreteStrategyA;
			}

			const Proxy = SubConstructorProxy(MyProcessor);

			assert.equal(Proxy.Strategy, ConcreteStrategyA);
		});

		it('should work with another sub-constructor.', () => {
			class MyProcessor extends AbstractProcessor {
				static Strategy = ConcreteStrategyB;
			}

			const Proxy = SubConstructorProxy(MyProcessor);

			assert.equal(Proxy.Strategy, ConcreteStrategyB);
		});

		it('should throw if static member is not a valid sub-constructor.', () => {
			class MyProcessor extends AbstractProcessor {
				static Strategy = class NotRelated {};
			}

			const Proxy = SubConstructorProxy(MyProcessor);

			assert.throws(() => Proxy.Strategy, {
				name: 'TypeError',
				message: 'Invalid "member", one "BaseStrategy" expected.',
			});
		});
	});

	describe('multiple sub-constructor members', () => {
		class BaseInput { read() {} }
		class BaseOutput { write() {} }

		class FileInput extends BaseInput { read() { return 'file'; } }
		class ConsoleOutput extends BaseOutput { write() { return 'console'; } }

		const AbstractIOHandler = Abstract(
			class IOHandler {},
			Abstract({
				Input: SubConstructor(BaseInput),
				Output: SubConstructor(BaseOutput),
			}),
		);

		it('should validate multiple sub-constructor members.', () => {
			class MyHandler extends AbstractIOHandler {
				get Input() { return FileInput; }
				get Output() { return ConsoleOutput; }
			}

			const handler = new MyHandler();

			assert.equal(handler.Input, FileInput);
			assert.equal(handler.Output, ConsoleOutput);
		});

		it('should throw if one of the members is invalid.', () => {
			class MyHandler extends AbstractIOHandler {
				get Input() { return FileInput; }
				get Output() { return FileInput; } // Wrong: FileInput is not sub of BaseOutput
			}

			const handler = new MyHandler();

			assert.equal(handler.Input, FileInput);
			assert.throws(() => handler.Output, {
				name: 'TypeError',
				message: 'Invalid "member", one "BaseOutput" expected.',
			});
		});
	});
});
