<?php
/**
 * Exploring our world page.
 */
get_header();
$d = get_template_directory_uri() . '/assets';
?>
<header data-bar></header>
<main class="notebook">
	<h1><?php echo esc_html( am_sections()['world'][0] ); ?></h1>
	<h2 id="nature">Nature</h2>
	<h2 id="adventure">Adventure</h2>
	<h3>Tour du Mont Blanc</h3>
	<p class="date">Late July 2025</p>
	<div class="videos">
		<video src="<?php echo esc_url( $d ); ?>/video/tmb-1.mp4" poster="<?php echo esc_url( $d ); ?>/video/tmb-1.jpg" width="1920" height="1080" controls playsinline preload="metadata"></video>
		<video src="<?php echo esc_url( $d ); ?>/video/tmb-2.mp4" poster="<?php echo esc_url( $d ); ?>/video/tmb-2.jpg" width="1080" height="1920" controls playsinline preload="metadata"></video>
	</div>
</main>
<?php
get_footer();
