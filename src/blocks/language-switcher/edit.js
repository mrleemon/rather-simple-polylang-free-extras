/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	Disabled
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { ServerSideRender } from '@wordpress/server-side-render';

const Edit = (props) => {

	const blockProps = useBlockProps();
	const {
		attributes: { dropdown, showNames, displayNamesAs, showFlags, forceHome, hideCurrent, hideIfNoTranslation, hideIfEmpty },
		setAttributes,
	} = props;

	const toggleDropdown = (value) => {
		setAttributes({ dropdown: value });
	}

	const toggleShowNames = (value) => {
		setAttributes({ showNames: value });
	}

	const setDisplayNamesAs = (value) => {
		setAttributes({ displayNamesAs: value });
	}

	const toggleShowFlags = (value) => {
		setAttributes({ showFlags: value });
	}

	const toggleForceHome = (value) => {
		setAttributes({ forceHome: value });
	}

	const toggleHideCurrent = (value) => {
		setAttributes({ hideCurrent: value });
	}

	const toggleHideIfNoTranslation = (value) => {
		setAttributes({ hideIfNoTranslation: value });
	}

	const toggleHideEmpty = (value) => {
		setAttributes({ hideIfEmpty: value });
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'rather-simple-polylang-free-extras')}>
					<ToggleControl
						label={__('Displays as a dropdown', 'rather-simple-polylang-free-extras')}
						checked={!!dropdown}
						onChange={toggleDropdown}
					/>
					<ToggleControl
						label={__('Displays language names', 'rather-simple-polylang-free-extras')}
						checked={!!showNames}
						onChange={toggleShowNames}
					/>
					{!!showNames && (
						<SelectControl
							label={__('Display language names as', 'rather-simple-polylang-free-extras')}
							value={displayNamesAs}
							options={[
								{ label: __('Name', 'rather-simple-polylang-free-extras'), value: 'name' },
								{ label: __('Slug', 'rather-simple-polylang-free-extras'), value: 'slug' },
							]}
							onChange={setDisplayNamesAs}
						/>
					)}
					<ToggleControl
						label={__('Displays flags', 'rather-simple-polylang-free-extras')}
						checked={!!showFlags}
						onChange={toggleShowFlags}
					/>
					<ToggleControl
						label={__('Forces link to front page', 'rather-simple-polylang-free-extras')}
						checked={!!forceHome}
						onChange={toggleForceHome}
					/>
					{!dropdown && (
						<ToggleControl
							label={__('Hides the current language', 'rather-simple-polylang-free-extras')}
							checked={!!hideCurrent}
							onChange={toggleHideCurrent}
						/>
					)}
					<ToggleControl
						label={__('Hides languages with no translation', 'rather-simple-polylang-free-extras')}
						checked={!!hideIfNoTranslation}
						onChange={toggleHideIfNoTranslation}
					/>
					<ToggleControl
						label={__('Hides empty languages', 'rather-simple-polylang-free-extras')}
						checked={!!hideIfEmpty}
						onChange={toggleHideEmpty}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<Disabled>
					<ServerSideRender
						block="occ/rather-simple-polylang-language-switcher"
						attributes={props.attributes}
					/>
				</Disabled>
			</div >
		</>
	);

}

export default Edit;
