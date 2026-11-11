<?php
/**
 * Ayal Meyers theme setup.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'AM_VERSION', '1.3.0' );

/**
 * The site's sections. key => [ page title, page slug, default intro ].
 * The intro is written into the page when the theme creates it, so it can be edited in WordPress.
 */
function am_sections() {
	return array(
		'connections' => array( 'Connections', 'connections', '' ),
		'writing'     => array( 'Writing', 'writing', '' ),
		'books'       => array( 'Books', 'books', '' ),
		'music'       => array( 'Music', 'music', '' ),
		'art'         => array( 'Art & Design', 'art-and-design', '' ),
		'modeling'    => array( 'Modeling', 'modeling', '' ),
		'subjects'    => array( 'Subjects', 'subjects', '' ),
		'world'       => array( 'Exploring our world', 'exploring-our-world', '' ),
		'people'      => array( 'People', 'people', '' ),
		'door'        => array( 'Door', 'door', '' ),
	);
}

/** Address of a section page (or the home page). */
function am_url( $key ) {
	if ( 'home' === $key ) {
		return home_url( '/' );
	}
	$sections = am_sections();
	if ( ! isset( $sections[ $key ] ) ) {
		return home_url( '/' );
	}
	$page = get_page_by_path( $sections[ $key ][1] );
	return $page ? get_permalink( $page ) : home_url( '/' . $sections[ $key ][1] . '/' );
}

/** Section key for the page being viewed. */
function am_current_key() {
	if ( is_front_page() ) {
		return 'home';
	}
	if ( is_page() ) {
		$slug = get_post_field( 'post_name', get_queried_object_id() );
		foreach ( am_sections() as $key => $s ) {
			if ( $s[1] === $slug ) {
				return $key;
			}
		}
	}
	return '';
}

/** Page intro: the page's own text if it has any, otherwise the default. */
function am_intro( $key ) {
	$content = '';
	if ( have_posts() ) {
		the_post();
		$content = trim( get_the_content() );
		rewind_posts();
	}
	if ( '' !== $content ) {
		echo apply_filters( 'the_content', $content ); // phpcs:ignore WordPress.Security.EscapeOutput
		return;
	}
	$sections = am_sections();
	if ( ! empty( $sections[ $key ][2] ) ) {
		echo '<p>' . esc_html( $sections[ $key ][2] ) . '</p>';
	}
}

add_action(
	'after_setup_theme',
	function () {
		add_theme_support( 'title-tag' );
		add_theme_support( 'html5', array( 'style', 'script' ) );
	}
);

/** Create any missing section pages when the theme is activated. */
function am_create_pages() {
	foreach ( am_sections() as $key => $s ) {
		if ( get_page_by_path( $s[1] ) ) {
			continue;
		}
		wp_insert_post(
			array(
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_title'   => $s[0],
				'post_name'    => $s[1],
				'post_content' => $s[2] ? '<!-- wp:paragraph --><p>' . esc_html( $s[2] ) . '</p><!-- /wp:paragraph -->' : '',
			)
		);
	}
	// Pretty addresses like /writing/ instead of ?page_id=12.
	if ( '' === get_option( 'permalink_structure' ) ) {
		update_option( 'permalink_structure', '/%postname%/' );
	}
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'am_create_pages' );

add_action(
	'wp_enqueue_scripts',
	function () {
		$uri = get_template_directory_uri() . '/assets/';
		$ver = AM_VERSION;

		wp_enqueue_style( 'am-fonts', 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500&display=swap', array(), null );
		wp_enqueue_style( 'am-style', $uri . 'style.css', array( 'am-fonts' ), $ver );

		wp_enqueue_script( 'am-data', $uri . 'data.js', array(), $ver, true );
		wp_enqueue_script( 'am-site', $uri . 'site.js', array( 'am-data' ), $ver, true );

		$urls = array( 'home' => am_url( 'home' ) );
		foreach ( array_keys( am_sections() ) as $key ) {
			$urls[ $key ] = am_url( $key );
		}
		wp_add_inline_script(
			'am-site',
			'window.SITE_URLS = ' . wp_json_encode( $urls ) . '; window.SITE_HERE = ' . wp_json_encode( am_current_key() ) . ';',
			'before'
		);

		$key = am_current_key();
		if ( 'home' === $key ) {
			wp_enqueue_script( 'am-graph', $uri . 'graph.js', array( 'am-site' ), $ver, true );
			wp_enqueue_script( 'am-world', $uri . 'world.js', array(), $ver, true );
			wp_enqueue_script( 'am-forms', $uri . 'forms.js', array(), $ver, true );
			wp_enqueue_script( 'am-hero', $uri . 'hero.js', array( 'am-graph', 'am-world', 'am-forms' ), $ver, true );
		} elseif ( 'music' === $key ) {
			wp_enqueue_script( 'am-music', $uri . 'music.js', array(), $ver, true );
		} elseif ( 'door' === $key ) {
			wp_dequeue_script( 'am-site' );
			wp_enqueue_script( 'am-supabase', 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.50.0/dist/umd/supabase.js', array(), null, true );
			wp_enqueue_script( 'am-door-config', $uri . 'door-config.js', array(), $ver, true );
			wp_enqueue_script( 'am-door', $uri . 'door.js', array( 'am-supabase', 'am-door-config' ), $ver, true );
		} elseif ( 'connections' === $key ) {
			wp_enqueue_script( 'am-graph', $uri . 'graph.js', array( 'am-site' ), $ver, true );
			wp_enqueue_script( 'am-connections', $uri . 'connections.js', array( 'am-graph' ), $ver, true );
		}

		// This theme doesn't use blocks on the front end, so drop their styles.
		wp_dequeue_style( 'wp-block-library' );
		wp_dequeue_style( 'wp-block-library-theme' );
		wp_dequeue_style( 'global-styles' );
		wp_dequeue_style( 'classic-theme-styles' );
	},
	20
);

add_action(
	'wp_head',
	function () {
		echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
		echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
		if ( 'door' === am_current_key() ) {
			echo '<meta name="robots" content="noindex, nofollow">' . "\n";
		}
		if ( is_front_page() ) {
			echo '<meta name="description" content="' . esc_attr( 'Ayal Meyers. Neuroscience, consciousness, politics and philosophy, and how they connect to writing, books, music, art, modeling, people and the outdoors.' ) . '">' . "\n";
		}
	},
	1
);

// Home page title is just the name; section pages read "Writing · Ayal Meyers".
add_filter( 'document_title_separator', function () { return '·'; } );
add_filter(
	'document_title_parts',
	function ( $parts ) {
		if ( is_front_page() || 'door' === am_current_key() ) {
			return array( 'title' => get_bloginfo( 'name' ) );
		}
		unset( $parts['tagline'] );
		return $parts;
	}
);

remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
