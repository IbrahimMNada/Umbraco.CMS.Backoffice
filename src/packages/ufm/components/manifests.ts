import type { ManifestUfmComponent } from '../ufm-component.extension.js';

export const manifests: Array<ManifestUfmComponent> = [
	{
		type: 'ufmComponent',
		alias: 'Umb.Markdown.LabelValue',
		name: 'Label Value UFM Component',
		api: () => import('./label-value/label-value.component.js'),
		meta: { marker: '=' },
	},
	{
		type: 'ufmComponent',
		alias: 'Umb.Markdown.Localize',
		name: 'Localize UFM Component',
		api: () => import('./localize/localize.component.js'),
		meta: { marker: '#' },
	},
	{
		type: 'ufmComponent',
		alias: 'Umb.Markdown.ContentName',
		name: 'Content Name UFM Component',
		api: () => import('./content-name/content-name.component.js'),
		meta: { marker: '~' },
	},
	{
		type: 'ufmComponent',
		alias: 'Umb.Markdown.UrlPickerInList',
		name: 'Url Picker In List',
		api: () => import('./url-picker-in-list/url-picker-in-list.component.js'),
		meta: { marker: '@' },
	},
];
