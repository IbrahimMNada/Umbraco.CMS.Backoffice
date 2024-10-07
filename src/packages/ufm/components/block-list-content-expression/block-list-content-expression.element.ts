import { UmbUfmElementBase } from '../ufm-element-base.js';
import { customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UMB_BLOCK_ENTRY_CONTEXT } from '@umbraco-cms/backoffice/block';

const elementName = 'ufm-url-picker-in-list';
@customElement(elementName)
export class BlockListContentExpressionElement extends UmbUfmElementBase {
	@property()
	alias?: string;

	constructor() {
		super();
		this.consumeContext(UMB_BLOCK_ENTRY_CONTEXT, async (context) => {
			var content = await context.contentValues();
			this.observe(
				content,
				(value) => {
					var exprestionValue = this.getValueFromExpression(value, this.alias!);
					if (exprestionValue === undefined) {
						this.observe(context.contentElementTypeName, (value) => {
							this.value = this.localize.term(value!);
						});
					}else{
						this.value = exprestionValue;
					}	
				},
				'observeValue',
			);
		});
	}
}
export { BlockListContentExpressionElement as element };
declare global {
	interface HTMLElementTagNameMap {
		[elementName]: BlockListContentExpressionElement;
	}
}