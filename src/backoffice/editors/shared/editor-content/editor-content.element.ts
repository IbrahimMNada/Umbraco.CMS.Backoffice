import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UUIInputElement, UUIInputEvent } from '@umbraco-ui/uui';
import { distinctUntilChanged } from 'rxjs';
import { UmbNodeStore } from '../../../../core/stores/node.store';
import { NodeEntity } from '../../../../core/mocks/data/node.data';
import type { UmbNotificationService } from '../../../../core/services/notification';
import { UmbNotificationDefaultData } from '../../../../core/services/notification/layouts/default';
import { UmbNodeContext } from './node.context';
import { UmbObserverMixin } from '@umbraco-cms/observable-api';
import { UmbContextConsumerMixin, UmbContextProviderMixin } from '@umbraco-cms/context-api';

import '../editor-entity-layout/editor-entity-layout.element';

// Lazy load
// TODO: Make this dynamic, use load-extensions method to loop over extensions for this node.
import './views/edit/editor-view-content-edit.element';
import './views/info/editor-view-content-info.element';
import { UmbDocumentStore } from 'src/core/stores/document/document.store';
import { UmbMediaStore } from 'src/core/stores/media/media.store';

@customElement('umb-editor-content')
export class UmbEditorContentElement extends UmbContextProviderMixin(
	UmbContextConsumerMixin(UmbObserverMixin(LitElement))
) {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}

			#popover {
				display: block;
			}

			#dropdown {
				overflow: hidden;
				z-index: -1;
				background-color: var(--uui-combobox-popover-background-color, var(--uui-color-surface));
				border: 1px solid var(--uui-color-border);
				border-radius: var(--uui-border-radius);
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				box-shadow: var(--uui-shadow-depth-3);
			}

			uui-input {
				width: 100%;
			}
		`,
	];

	@property()
	entityKey!: string;

	@property()
	alias!: string;

	@state()
	_content?: NodeEntity;

	private _store?: UmbDocumentStore | UmbMediaStore;
	private _nodeContext?: UmbNodeContext;
	private _notificationService?: UmbNotificationService;

	constructor() {
		super();

		this.consumeAllContexts(['umbContentStore', 'umbNotificationService'], (instances) => {
			this._store = instances['umbContentStore'];
			this._notificationService = instances['umbNotificationService'];
			this._observeContent();
		});

		this.addEventListener('property-value-change', this._onPropertyValueChange);
	}

	private _onPropertyValueChange = (e: Event) => {
		const target = e.composedPath()[0] as any;

		// TODO: Set value.
		const property = this._content?.properties.find((x) => x.alias === target.alias);
		if (property) {
			this._setPropertyValue(property.alias, target.value);
		} else {
			console.error('property was not found', target.alias);
		}
	};

	private _setPropertyValue(alias: string, value: unknown) {
		this._content?.data.forEach((data) => {
			if (data.alias === alias) {
				data.value = value;
			}
		});
	}

	private _observeContent() {
		if (!this._store) return;

		this.observe<NodeEntity>(this._store.getByKey(this.entityKey), (content) => {
			if (!content) return; // TODO: Handle nicely if there is no node.

			if (!this._nodeContext) {
				this._nodeContext = new UmbNodeContext(content);
				this.provideContext('umbNodeContext', this._nodeContext);
			} else {
				this._nodeContext.update(content);
			}

			this.observe<NodeEntity>(this._nodeContext.data.pipe(distinctUntilChanged()), (data) => {
				this._content = data;
			});
		});
	}

	private _onSaveAndPublish() {
		this._onSave();
	}

	private _onSave() {
		// TODO: What if store is not present, what if content is not loaded....
		if (this._content) {
			this._store?.save([this._content]).then(() => {
				const data: UmbNotificationDefaultData = { message: 'Document Saved' };
				this._notificationService?.peek('positive', { data });
			});
		}
	}

	private _onSaveAndPreview() {
		this._onSave();
	}

	// TODO. find a way where we don't have to do this for all editors.
	private _handleInput(event: UUIInputEvent) {
		if (event instanceof UUIInputEvent) {
			const target = event.composedPath()[0] as UUIInputElement;

			if (typeof target?.value === 'string') {
				this._nodeContext?.update({ name: target.value });
			}
		}
	}

	private _toggleVariantSelector() {
		this._variantSelectorIsOpen = !this._variantSelectorIsOpen;
	}

	@state()
	private _variantSelectorIsOpen = false;

	private _close() {
		this._variantSelectorIsOpen = false;
	}

	render() {
		return html`
			<umb-editor-entity-layout alias=${this.alias}>
				<div slot="name">
					<uui-input .value=${this._content?.name} @input="${this._handleInput}">
						<!-- Implement Variant Selector -->
						${this._content && this._content.variants.length > 0
							? html`
									<div slot="append">
										<uui-button id="trigger" @click=${this._toggleVariantSelector}>
											English (United States)
											<uui-caret></uui-caret>
										</uui-button>
									</div>
							  `
							: nothing}
					</uui-input>

					<!-- Implement Variant Selector -->
					${this._content && this._content.variants.length > 0
						? html`
								<uui-popover id="popover" .open=${this._variantSelectorIsOpen} @close=${this._close}>
									<div id="dropdown" slot="popover">
										<uui-scroll-container id="scroll-container">
											<ul>
												<li>Implement variants</li>
											</ul>
										</uui-scroll-container>
									</div>
								</uui-popover>
						  `
						: nothing}
				</div>

				<div slot="footer">Breadcrumbs</div>

				<div slot="actions">
					<uui-button @click=${this._onSaveAndPreview} label="Save and preview"></uui-button>
					<uui-button @click=${this._onSave} look="secondary" label="Save"></uui-button>
					<uui-button
						@click=${this._onSaveAndPublish}
						look="primary"
						color="positive"
						label="Save and publish"></uui-button>
				</div>
			</umb-editor-entity-layout>
		`;
	}
}

export default UmbEditorContentElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-editor-content': UmbEditorContentElement;
	}
}
