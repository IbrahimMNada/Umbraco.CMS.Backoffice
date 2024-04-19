import type { UmbEntryPointModule } from '../models/index.js';
import type { ManifestPlainJs } from './base.types.js';

/**
 * Manifest for an `appEntryPoint`, which is loaded up front when the app starts.
 *
 * This type of extension gives full control and will simply load the specified JS file.
 * You could have custom logic to decide which extensions to load/register by using extensionRegistry.
 * This is useful for extensions that need to be loaded up front, like an `authProvider`.
 */
export interface ManifestAppEntryPoint extends ManifestPlainJs<UmbEntryPointModule> {
	type: 'appEntryPoint';
}