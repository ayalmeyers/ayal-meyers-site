<?php
/**
 * Exploring our world page.
 */
get_header();
?>
<header data-bar></header>
<main class="notebook">
	<h1><?php echo esc_html( am_sections()['world'][0] ); ?></h1>
	<?php am_intro( 'world' ); ?>
	<div data-list="world"></div>
	<h2>How nature connects</h2>
	<div data-edges="nature"></div>
	<h2>How adventure connects</h2>
	<div data-edges="adventure"></div>
</main>
<?php
get_footer();
