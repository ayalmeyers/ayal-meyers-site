<?php
/**
 * Books page.
 */
get_header();
?>
<header data-bar></header>
<main class="notebook">
	<h1><?php echo esc_html( am_sections()['books'][0] ); ?></h1>
	<?php am_intro( 'books' ); ?>
	<div data-list="books"></div>
	<h2>How it connects</h2>
	<div data-edges="books"></div>
</main>
<?php
get_footer();
