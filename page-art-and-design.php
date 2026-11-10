<?php
/**
 * Art & Design page.
 */
get_header();
?>
<header data-bar></header>
<main class="notebook">
	<h1><?php echo esc_html( am_sections()['art'][0] ); ?></h1>
	<?php am_intro( 'art' ); ?>
	<div data-list="art"></div>
	<h2>How it connects</h2>
	<div data-edges="art"></div>
</main>
<?php
get_footer();
