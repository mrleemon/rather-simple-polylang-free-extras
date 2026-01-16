import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';
import { PanelBody, SelectControl, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';


function addLanguageVisibilityAttribute(settings, name) {
	return {
		...settings,
		attributes: {
			...settings.attributes,
			languageVisibility: { type: 'string' }
		}
	};
}

/*
const withMyPluginControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		return (
			<>
				<BlockEdit key="edit" { ...props } />
				<InspectorControls>
					<PanelBody>My custom control</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withMyPluginControls' );*/


const withMyPluginControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes } = props;
		const [languages, setLanguages] = useState([]);
		const [isLoading, setIsLoading] = useState(true);

		// Fetch languages from Polylang REST API
		useEffect(() => {
			apiFetch({ path: '/pll/v1/languages' })
				.then((response) => {
					const options = response.map((lang) => ({
						label: lang.name,
						value: lang.slug,
					}));
					setLanguages(options);
					setIsLoading(false);
				})
				.catch(() => {
					setIsLoading(false);
				});
		}, []);

		return (
			<>
				<BlockEdit key="edit" {...props} />
				{props.isSelected && (
					<InspectorControls>
						<PanelBody title={__('Language settings', 'rather-simple-polylang-rest-api')}>
							{isLoading ? (
								<Spinner />
							) : (
								<SelectControl
									label={__('This block is displayed for:', 'rather-simple-polylang-rest-api')}
									value={attributes.languageVisibility}
									options={[
										{
											label: __('All languages', 'rather-simple-polylang-rest-api'),
											value: ''
										},
										...languages
									]}
									onChange={(value) => setAttributes({ languageVisibility: value })}
								/>
							)}
						</PanelBody>
					</InspectorControls>
				)}
			</>
		);
	};
}, 'withMyPluginControls');

addFilter(
	'blocks.registerBlockType',
	'occ/rather-simple-polylang-rest-api',
	addLanguageVisibilityAttribute
);




addFilter(
	'editor.BlockEdit',
	'occ/with-inspector-controls',
	withMyPluginControls
);