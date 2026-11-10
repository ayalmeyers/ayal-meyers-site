<?php
/**
 * Music page.
 */
get_header();
?>
<header data-bar></header>
<main class="notebook">
	<h1><?php echo esc_html( am_sections()['music'][0] ); ?></h1>
	<?php am_intro( 'music' ); ?>
	<div data-list="music"></div>
	<h2>How it connects</h2>
	<div data-edges="music"></div>
</main>
<?php
get_footer();
