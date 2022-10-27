import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbUserGroupStore } from '../../../../../core/stores/user/user-group.store';
import type {
	UmbTableElement,
	UmbTableColumn,
	UmbTableConfig,
	UmbTableDeselectedEvent,
	UmbTableItem,
	UmbTableOrderedEvent,
	UmbTableSelectedEvent,
} from '../../../../components/table';
import { UmbContextConsumerMixin } from '@umbraco-cms/context-api';
import type { UserGroupDetails } from '@umbraco-cms/models';

import './user-group-table-name-column-layout.element';
import './user-group-table-sections-column-layout.element';
import { UmbObserverMixin } from '@umbraco-cms/observable-api';
import { umbExtensionsRegistry } from '@umbraco-cms/extensions-registry';

@customElement('umb-editor-view-user-groups')
export class UmbEditorViewUserGroupsElement extends UmbContextConsumerMixin(UmbObserverMixin(LitElement)) {
	static styles = [
		UUITextStyles,
		css`
			:host {
				height: 100%;
				display: flex;
				flex-direction: column;
			}
		`,
	];

	@state()
	private _userGroups: Array<UserGroupDetails> = [];

	@state()
	private _tableConfig: UmbTableConfig = {
		allowSelection: true,
	};

	@state()
	private _tableColumns: Array<UmbTableColumn> = [
		{
			name: 'Name',
			alias: 'userGroupName',
			elementName: 'umb-user-group-table-name-column-layout',
		},
		{
			name: 'Sections',
			alias: 'userGroupSections',
			elementName: 'umb-user-group-table-sections-column-layout',
		},
		{
			name: 'Content start node',
			alias: 'userGroupContentStartNode',
		},
		{
			name: 'Media start node',
			alias: 'userGroupMediaStartNode',
		},
	];

	@state()
	private _tableItems: Array<UmbTableItem> = [];

	@state()
	private _selection: Array<string> = [];

	private _userGroupStore?: UmbUserGroupStore;

	connectedCallback(): void {
		super.connectedCallback();

		this.consumeContext('umbUserGroupStore', (userStore: UmbUserGroupStore) => {
			this._userGroupStore = userStore;
			this._observeUserGroups();
		});
	}

	private _observeUserGroups() {
		if (!this._userGroupStore) return;

		this.observe<UserGroupDetails[]>(this._userGroupStore.getAll(), (userGroups) => {
			this._userGroups = userGroups;
			this._createTableItems(this._userGroups);
		});
	}

	private _createTableItems(userGroups: Array<UserGroupDetails>) {
		this._tableItems = userGroups.map((userGroup) => {
			return {
				key: userGroup.key,
				icon: userGroup.icon,
				data: [
					{
						columnAlias: 'userGroupName',
						value: {
							name: userGroup.name,
						},
					},
					{
						columnAlias: 'userGroupSections',
						value: userGroup.sections,
					},
					{
						columnAlias: 'userGroupContentStartNode',
						value: userGroup.contentStartNode,
					},
					{
						columnAlias: 'userGroupMediaStartNode',
						value: userGroup.mediaStartNode,
					},
				],
			};
		});
	}

	private _handleSelected(event: UmbTableSelectedEvent) {
		event.stopPropagation();
		console.log('HANDLE SELECT');
	}

	private _handleDeselected(event: UmbTableDeselectedEvent) {
		event.stopPropagation();
		console.log('HANDLE DESELECT');
	}

	private _handleOrdering(event: UmbTableOrderedEvent) {
		const table = event.target as UmbTableElement;
		const orderingColumn = table.orderingColumn;
		const orderingDesc = table.orderingDesc;
		console.log(`fetch users, order column: ${orderingColumn}, desc: ${orderingDesc}`);
	}

	render() {
		return html`
			<umb-table
				.config=${this._tableConfig}
				.columns=${this._tableColumns}
				.items=${this._tableItems}
				.selection=${this._selection}
				@selected="${this._handleSelected}"
				@deselected="${this._handleDeselected}"
				@ordered="${this._handleOrdering}"></umb-table>
		`;
	}
}

export default UmbEditorViewUserGroupsElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-editor-view-user-groups': UmbEditorViewUserGroupsElement;
	}
}
