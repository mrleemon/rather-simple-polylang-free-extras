/**
 * WordPress dependencies
 */
import {
	Path,
	SVG,
} from '@wordpress/primitives';
import {
	registerBlockType
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Edit from './edit';

import './style.scss';

const { name } = metadata;

export const settings = {
	icon: {
		src: <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
			<Path d="m15.341 8.27h-1.6813l-3.6593 10.38h1.6813l0.89011-2.5703h3.8571l0.89011 2.5703h1.6813zm-2.1758 6.228 1.3846-3.9543 1.3846 3.9543zm-4.7473-3.7566c1.5824-1.7794 2.8681-3.5589 3.6593-5.6349h1.7802v-1.5817h-5.7363v-2.1749h-1.3846v2.1749h-5.7363v1.4829h9.4945c-0.69231 1.5817-1.7802 3.0646-3.0659 4.5474-0.89011-1.0874-1.6813-2.2737-2.2747-3.2623h-1.5824c0.59341 1.384 1.6813 2.8669 2.8681 4.3497l-2.3736 2.3726c-0.2967 0.39543-0.69231 0.79086-1.0879 1.1863l0.98901 0.98857 1.1868-1.1863c0.79121-0.79086 1.5824-1.4829 2.2747-2.2737 0.79121 0.88971 1.6813 1.6806 2.4725 2.4714l0.59341-1.4829c-0.69231-0.59314-1.3846-1.2851-2.0769-1.9771z"/>
		</SVG>,
		foreground: '#ff8a00'
	},

	edit: Edit,
};

registerBlockType(name, settings);
