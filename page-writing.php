<?php
/**
 * Writing page.
 */
get_header();
?>
<header data-bar></header>
<main class="notebook">
	<h1><?php echo esc_html( am_sections()['writing'][0] ); ?></h1>
	<?php am_intro( 'writing' ); ?>
	<div data-list="writing"></div>
	<h2>How it connects</h2>
	<div data-edges="writing"></div>
</main>
<?php
get_footer();
