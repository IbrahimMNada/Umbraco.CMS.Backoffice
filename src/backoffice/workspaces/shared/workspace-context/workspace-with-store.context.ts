import { Subscription } from "rxjs";
import { UmbWorkspaceContext } from "./workspace.context";
import { UmbContextConsumer } from "@umbraco-cms/context-api";
import { UmbNotificationService } from "@umbraco-cms/services";
import { UmbDataStoreBase } from "@umbraco-cms/stores/store";
import { ContentTreeItem } from "@umbraco-cms/backend-api";

export abstract class UmbWorkspaceWithStoreContext<DataType extends ContentTreeItem, StoreType extends UmbDataStoreBase<DataType>> extends UmbWorkspaceContext<DataType> {


	protected _notificationConsumer!:UmbContextConsumer;
	protected _notificationService?: UmbNotificationService;

	protected _storeConsumer!:UmbContextConsumer;
	protected _store!: StoreType; // TODO: Double check its right to assume it here, at least from a type perspective?

	protected _dataObserver?:Subscription;

	public entityType:string;
	public entityKey:string;


	constructor(target:HTMLElement, defaultData:DataType, storeAlias:string, entityType: string, entityKey: string) {
		super(target, defaultData)
		this.entityType = entityType;
		this.entityKey = entityKey;

		this._notificationConsumer = new UmbContextConsumer(this._target, 'umbNotificationService', (_instance: UmbNotificationService) => {
			this._notificationService = _instance;
		});

		// TODO: consider if store alias should be configurable of manifest:
		this._storeConsumer = new UmbContextConsumer(this._target, storeAlias, (_instance: StoreType) => {
			this._store = _instance;
			if(!this._store) {
				// TODO: if we keep the type assumption of _store existing, then we should here make sure to break the application in a good way.
				return;
			}
			this._onStoreSubscription();
		});
	}

	connectedCallback() {
		this._notificationConsumer.attach();
		this._storeConsumer.attach();
	}

	disconnectedCallback() {
		this._notificationConsumer.detach();
		this._storeConsumer.detach();
	}

	protected abstract _onStoreSubscription(): void
	/* {
		this._dataObserver = this._store.getByKey(this.entityKey).subscribe((content) => {
			if (!content) return; // TODO: Handle nicely if there is no content data.
			this.update(content as any);
		});
	}*/


	public getStore():StoreType {
		return this._store;
	}



	/*
	// Document Store:
	public save() {
		this._store.save([this.getData()]).then(() => {
			const data: UmbNotificationDefaultData = { message: 'Document Saved' };
			this._notificationService?.peek('positive', { data });
		}).catch(() => {
			const data: UmbNotificationDefaultData = { message: 'Failed to save Document' };
			this._notificationService?.peek('danger', { data });
		});
	}
	*/




	public destroy(): void {
		super.destroy();
		if(this._storeConsumer) {
			this._storeConsumer.detach();
		}
		if(this._dataObserver) {
			// I want to make sure that we unsubscribe, also if store(observer source) changes.
			this._dataObserver?.unsubscribe();
		}
	}

}

