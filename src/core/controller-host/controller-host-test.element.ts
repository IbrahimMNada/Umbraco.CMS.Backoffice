import { html } from 'lit-html';
import { customElement, property } from 'lit/decorators.js';
import { UmbControllerHostInterface } from '@umbraco-cms/backoffice/controller';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

@customElement('umb-controller-host-test')
export class UmbControllerHostTestElement extends UmbLitElement {
	/**
	 * A way to initialize controllers.
	 * @required
	 */
	@property({ type: Object, attribute: false })
	create?: (host: UmbControllerHostInterface) => void;

	connectedCallback() {
		super.connectedCallback();
		if (this.create) {
			this.create(this);
		}
	}

	render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-controller-host-test': UmbControllerHostTestElement;
	}
}