<?php
/**
 * Plugin Name: Rather Simple Polylang Free Extras
 * Plugin URI:
 * Update URI: false
 * Version: 1.0
 * Requires at least: 6.8
 * Requires PHP: 7.4
 * Requires Plugins: polylang
 * Author: Oscar Ciutat
 * Author URI: http://oscarciutat.com/code/
 * Text Domain: rather-simple-polylang-free-extras
 * Domain Path: /languages
 * Description: Adds basic REST API support, a language switcher block and a selector to filter blocks by language to the free version of Polylang.
 * License: GPLv2 or later
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2, as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @package rather_simple_polylang_free_extras
 */

/**
 * Core class used to implement the plugin.
 */
class Rather_Simple_Polylang_Free_Extras {

	/**
	 * Plugin instance.
	 *
	 * @var object $instance
	 */
	protected static $instance = null;

	/**
	 * Access this plugin’s working instance.
	 */
	public static function get_instance() {

		if ( ! self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Used for regular plugin work.
	 */
	public function plugin_setup() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
		add_action( 'init', array( $this, 'register_block' ) );
		add_filter( 'register_block_type_args', array( $this, 'register_block_type_args' ), 10, 2 );
		add_filter( 'render_block', array( $this, 'render_block' ), 10, 2 );
	}

	/**
	 * Constructor. Intentionally left empty and public.
	 */
	public function __construct() {}

	/**
	 * Enqueues block editor assets
	 *
	 * @throws Error If block is not built.
	 */
	public function enqueue_block_editor_assets() {
		$current_screen = get_current_screen();
		if ( 'post' === $current_screen->base ) {
			// Don't add in the post editor.
			return;
		}

		$dir               = __DIR__;
		$script_asset_path = "$dir/build/index.asset.php";
		if ( ! file_exists( $script_asset_path ) ) {
			throw new Error(
				'You need to run `npm start` or `npm run build` for the block first.'
			);
		}
		$script_asset = require $script_asset_path;

		// Load styles.
		wp_enqueue_style(
			'rather-simple-polylang-free-extras-css',
			plugins_url( 'build/index.css', __FILE__ ),
			array(),
			filemtime( plugin_dir_path( __FILE__ ) . 'build/index.css' )
		);

		// Load scripts.
		wp_enqueue_script(
			'rather-simple-polylang-free-extras',
			plugins_url( 'build/index.js', __FILE__ ),
			$script_asset['dependencies'],
			filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' ),
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);

		// Translate scripts.
		wp_set_script_translations( 'rather-simple-polylang-free-extras', 'rather-simple-polylang-free-extras', plugin_dir_path( __FILE__ ) . 'languages' );
	}

	/**
	 * Initializes REST API filters for Polylang language support.
	 */
	public function rest_api_init() {
		// Loop through all post types enabled for REST.
		foreach ( get_post_types( array( 'show_in_rest' => true ) ) as $post_type ) {
			// Check if Polylang is actually managing translations for this post type.
			if ( function_exists( 'pll_is_translated_post_type' ) && ! pll_is_translated_post_type( $post_type ) ) {
				continue;
			}
			add_filter(
				"rest_{$post_type}_query",
				array( $this, 'rest_polylang_apply_lang' ),
				10,
				2
			);
		}

		// Loop through all taxonomies enabled for REST.
		foreach ( get_taxonomies( array( 'show_in_rest' => true ) ) as $taxonomy ) {
			// Check if Polylang is actually managing translations for this taxonomy.
			if ( function_exists( 'pll_is_translated_taxonomy' ) && ! pll_is_translated_taxonomy( $taxonomy ) ) {
				continue;
			}
			add_filter(
				"rest_{$taxonomy}_query",
				array( $this, 'rest_polylang_apply_lang' ),
				10,
				2
			);
		}
	}

	/**
	 * Applies Polylang language filter to REST API queries.
	 *
	 * @param array           $args    The REST API query arguments.
	 * @param WP_REST_Request $request The current REST API request.
	 * @return array Modified query arguments with language applied.
	 */
	public function rest_polylang_apply_lang( $args, $request ) {
		// Ensure Polylang is active.
		if ( ! function_exists( 'pll_languages_list' ) ) {
			return $args;
		}

		// Extract the 'lang' parameter from the request.
		$lang = $request->get_param( 'lang' );

		// If no language is specified, use the site default language.
		if ( ! $lang ) {
			$lang = pll_default_language();
		}

		// Ensure the language code is actually registered in Polylang.
		if ( ! in_array( $lang, pll_languages_list(), true ) ) {
			return $args;
		}

		// Add the language to the query.
		$args['lang'] = $lang;
		return $args;
	}

	/**
	 * Registers block
	 *
	 * @throws Error If block is not built.
	 */
	public function register_block() {
		if ( ! function_exists( 'register_block_type' ) ) {
			// The block editor is not active.
			return;
		}

		// Register the block.
		register_block_type( __DIR__ . '/build/blocks/language-switcher' );

		// Load translations.
		$script_handle = generate_block_asset_handle( 'occ/rather-simple-polylang-language-switcher', 'editorScript' );
		wp_set_script_translations( $script_handle, 'rather-simple-polylang-free-extras', plugin_dir_path( __FILE__ ) . 'languages' );
	}

	/**
	 * Adds a 'pll_lang' attribute to all blocks,
	 * including server-side rendered blocks.
	 * Using 'pll_lang' for consistency with Polylang Pro.
	 *
	 * Gutenberg only registers attributes for SSR blocks on the server.
	 * Without this filter, attributes added via `blocks.registerBlockType`
	 * in JavaScript would be ignored during rendering.
	 *
	 * @param array  $args       Array of arguments for registering a block type.
	 * @param string $block_name Block name including namespace.
	 *
	 * @return array Modified block type arguments.
	 */
	public function register_block_type_args( $args, $block_name ) {
		// List of blocks to exclude.
		$excluded_blocks = array(
			'core/widget-area',
			'core/legacy-widget',
			'occ/rather-simple-polylang-language-switcher',
		);

		// If this is an excluded block, return args unchanged.
		if ( in_array( $block_name, $excluded_blocks, true ) ) {
			return $args;
		}

		// Ensure the 'attributes' key exists in the args array to avoid errors.
		if ( ! isset( $args['attributes'] ) ) {
			$args['attributes'] = array();
		}

		// Add the 'pll_lang' attribute into the block schema.
		$args['attributes']['pll_lang'] = array(
			'type'    => 'string',
			'default' => '',
		);

		return $args;
	}

	/**
	 * Toggles block display based on the 'pll_lang' value.
	 *
	 * @param string $block_content The original block content.
	 * @param array  $block         The full block, including name and attributes.
	 * @return string The filtered block content.
	 */
	public function render_block( $block_content, $block ) {
		global $post;

		// Ensure we are on a valid post and Polylang is active.
		if ( ! $post instanceof WP_Post || ! function_exists( 'pll_get_post_language' ) ) {
			return $block_content;
		}

		// Extract the 'pll_lang' attribute from the block.
		$pll_lang = $block['attrs']['pll_lang'] ?? '';

		if ( '' !== $pll_lang ) {
			// Get the language slug of the current post.
			$post_language = pll_get_post_language( $post->ID, 'slug' );

			// If the post language doesn't match the block language, hide the block.
			if ( $post_language !== $pll_lang ) {
				return '';
			}
		}
		return $block_content;
	}
}

add_action( 'plugins_loaded', array( Rather_Simple_Polylang_Free_Extras::get_instance(), 'plugin_setup' ) );
