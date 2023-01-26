import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UmbTemplateWorkspaceContext } from './template-workspace.context';
import { UmbLitElement } from '@umbraco-cms/element';
import { UUIInputElement, UUITextareaElement } from '@umbraco-ui/uui';

@customElement('umb-template-workspace')
export class UmbTemplateWorkspaceElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}

			#content {
				height: 200px;
			}
		`,
	];

	private _entityKey!: string;
	@property()
	public get entityKey(): string {
		return this._entityKey;
	}
	public set entityKey(value: string) {
		this._entityKey = value;
	}

	@property()
	public create?: string | null;

	@state()
	private _name?: string | null = '';

	@state()
	private _content?: string | null = '';

	#templateWorkspaceContext = new UmbTemplateWorkspaceContext(this);

	async connectedCallback() {
		super.connectedCallback();

		// make sure the the context has received all dependencies
		await this.#templateWorkspaceContext.init();

		this.observe(this.#templateWorkspaceContext.name, (name) => {
			this._name = name;
		});

		this.observe(this.#templateWorkspaceContext.content, (content) => {
			this._content = content;
		});

		if (!this._entityKey && this.create !== undefined) {
			this.#templateWorkspaceContext.createScaffold(this.create);
			return;
		}

		this.#templateWorkspaceContext.load(this._entityKey);
	}

	// TODO: temp code for testing create and save
	#onNameInput(event: Event) {
		const target = event.target as UUIInputElement;
		const value = target.value as string;
		this.#templateWorkspaceContext.setName(value);
	}

	#onTextareaInput(event: Event) {
		const target = event.target as UUITextareaElement;
		const value = target.value as string;
		this.#templateWorkspaceContext.setContent(value);
	}

	#onSave() {
		this.#templateWorkspaceContext.update();
	}

	#onCreate() {
		if (this.create !== undefined) {
			this.#templateWorkspaceContext.create();
		}
	}

	render() {
		// TODO: add correct UI elements
		return html`<umb-workspace-layout>
			<uui-input .value=${this._name} @input=${this.#onNameInput}></uui-input>
			<uui-textarea id="content" .value=${this._content} @input="${this.#onTextareaInput}"></uui-textarea>
			<uui-button label="Save" look="primary" color="positive" @click=${this.#onSave}></uui-button>
			<uui-button label="Create" look="primary" color="positive" @click=${this.#onCreate}></uui-button>
		</umb-workspace-layout>`;
	}
}

export default UmbTemplateWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-template-workspace': UmbTemplateWorkspaceElement;
	}
}
