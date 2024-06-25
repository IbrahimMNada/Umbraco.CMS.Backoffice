import { UMB_BLOCK_GRID_TYPE, type UmbBlockGridTypeModel } from '../types.js';
import type { UmbWorkspaceModalData, UmbWorkspaceModalValue } from '@umbraco-cms/backoffice/modal';
import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export type UmbBlockGridTypeWorkspaceData = UmbWorkspaceModalData<UmbBlockGridTypeModel>;

export const UMB_BLOCK_GRID_TYPE_WORKSPACE_MODAL = new UmbModalToken<UmbBlockGridTypeWorkspaceData, UmbWorkspaceModalValue>(
	'Umb.Modal.Workspace',
	{
		modal: {
			type: 'sidebar',
			size: 'large',
		},
		data: { entityType: UMB_BLOCK_GRID_TYPE, preset: {allowAtRoot: true} },
	},
	// Recast the type, so the entityType data prop is not required:
) as UmbModalToken<Omit<UmbWorkspaceModalData, 'entityType' | 'preset'>, UmbWorkspaceModalValue>;
