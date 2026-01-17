
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	Spinner
} from '@wordpress/components';
import {
	useState,
	useEffect
} from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Add a 'languageVisibility' attribute to all blocks except 'core/widget-area' and 'core/legacy-widget'.
 *
 * @param   {Object} settings  Original block settings.
 * @returns {Object} Updated block settings with the new attribute.
 */
function addLanguageVisibilityAttribute(settings, name) {
	// List of blocks to exclude.
    const excludedBlocks = ['core/widget-area', 'core/legacy-widget'];

    // If this is an excluded block, return settings unchanged.
    if (excludedBlocks.includes(name)) {
        return settings;
    }

	return {
		...settings,
		attributes: {
			...settings.attributes,
			languageVisibility: {
				type: 'string',
				default: ''
			}
		}
	};
}

addFilter(
	'blocks.registerBlockType',
	'occ/rather-simple-polylang-free-extras',
	addLanguageVisibilityAttribute
);

/**
 * Inject a new panel into the block sidebar.
 */
const addLanguageSelectControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		// List of blocks to exclude.
        const excludedBlocks = ['core/widget-area', 'core/legacy-widget'];

        // If this is an excluded block, just return the original block without the extra UI.
        if (excludedBlocks.includes(props.name)) {
            return <BlockEdit {...props} />;
        }

		const { attributes, setAttributes } = props;
		const [languages, setLanguages] = useState([]);
		const [isLoading, setIsLoading] = useState(true);

		// Fetch the list of active languages from the Polylang REST API on mount.
		useEffect(() => {
			apiFetch({ path: '/pll/v1/languages' })
				.then((response) => {
					// Map API response to the format required by SelectControl.
					const options = response.map((lang) => ({
						label: lang.name,
						value: lang.slug,
					}));
					setLanguages(options);
					setIsLoading(false);
				})
				.catch(() => {
					// Ensure loading spinner stops even if the request fails.
					setIsLoading(false);
				});
		}, []);

		return (
			<>
				<BlockEdit key="edit" {...props} />
				{props.isSelected && (
					<InspectorControls>
						<PanelBody title={__('Block visibility by language', 'rather-simple-polylang-free-extras')}>
							{isLoading ? (
								<Spinner />
							) : (
								<SelectControl
									label={__('This block is displayed for:', 'rather-simple-polylang-free-extras')}
									value={attributes.languageVisibility}
									options={[
										{
											label: __('All languages', 'rather-simple-polylang-free-extras'),
											value: ''
										},
										...languages
									]}
									onChange={(value) => {
										setAttributes({
											languageVisibility: value === '' ? undefined : value
										});
									}}
								/>
							)}
						</PanelBody>
					</InspectorControls>
				)}
			</>
		);
	};
}, 'addLanguageSelectControl');

addFilter(
	'editor.BlockEdit',
	'occ/rather-simple-polylang-free-extras',
	addLanguageSelectControl
);