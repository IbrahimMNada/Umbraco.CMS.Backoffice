import type { ManifestClass } from './models';
import { UmbStoreBase, UmbTreeStoreBase } from '@umbraco-cms/backoffice/store';

export interface ManifestStore extends ManifestClass<UmbStoreBase> {
	type: 'store';
}

export interface ManifestTreeStore extends ManifestClass<UmbTreeStoreBase> {
	type: 'treeStore';
}