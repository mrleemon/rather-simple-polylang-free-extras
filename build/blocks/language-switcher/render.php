<?php
/**
 * All of the parameters passed to the function where this file is being required are accessible in this scope:
 *
 * @param array    $attributes     The array of attributes for this block.
 * @param string   $content        Rendered block output. ie. <InnerBlocks.Content />.
 * @param WP_Block $block          The instance of the WP_Block class that represents the block being rendered.
 *
 * @package jn_core
 */

?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
<?php
	$language_switcher = pll_the_languages(
		array(
			'echo'                   => 0,
			'dropdown'               => intval( $attributes['dropdown'] ?? 0 ),
			'show_names'             => intval( $attributes['showNames'] ?? 1 ),
			'display_names_as'       => esc_attr( $attributes['displayNamesAs'] ?? 'name' ),
			'show_flags'             => intval( $attributes['showFlags'] ?? 0 ),
			'hide_if_empty'          => intval( $attributes['hideIfEmpty'] ?? 1 ),
			'force_home'             => intval( $attributes['forceHome'] ?? 0 ),
			'hide_if_no_translation' => intval( $attributes['hideIfNoTranslation'] ?? 0 ),
			'hide_current'           => intval( $attributes['hideCurrent'] ?? 0 ),
		)
	);
	echo $language_switcher;
	?>
</div>
