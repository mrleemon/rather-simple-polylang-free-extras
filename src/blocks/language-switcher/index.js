/**
 * WordPress dependencies
 */
import {
	G,
	Path,
	Rect,
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

import './editor.scss';
import './style.scss';

const { name } = metadata;

export const settings = {
	icon: {
		src: <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
			<Path d="M 15.340659,8.25 H 13.659341 L 10,18.75 h 1.681319 l 0.89011,-2.6 h 3.857142 l 0.89011,2.6 H 19 Z m -2.175824,6.3 1.384616,-4 1.384615,4 z M 8.4175824,10.75 C 10,8.95 11.285714,7.15 12.076923,5.05 h 1.78022 V 3.45 H 8.1208791 V 1.25 H 6.7362637 v 2.2 H 1 v 1.5 h 9.494505 C 9.8021978,6.55 8.7142857,8.05 7.4285714,9.55 6.5384615,8.45 5.7472527,7.25 5.1538462,6.25 H 3.5714286 c 0.5934066,1.4 1.6813187,2.9 2.8681318,4.4 l -2.3736263,2.4 c -0.2967033,0.4 -0.6923077,0.8 -1.0879121,1.2 l 0.989011,1 1.1868132,-1.2 c 0.7912087,-0.8 1.5824175,-1.5 2.2747252,-2.3 0.7912088,0.9 1.6813187,1.7 2.4725275,2.5 l 0.5934061,-1.5 c -0.6923072,-0.6 -1.3846149,-1.3 -2.0769226,-2 z"/>
		</SVG>,
		foreground: '#ff8a00'
	},

	edit: Edit,
};

registerBlockType(name, settings);
