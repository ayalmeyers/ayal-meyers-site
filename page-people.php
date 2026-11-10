<?php
/**
 * People page.
 */
get_header();
?>
<header data-bar></header>
<main class="notebook">
	<h1><?php echo esc_html( am_sections()['people'][0] ); ?></h1>
	<?php am_intro( 'people' ); ?>
	<?php /* To add people from your own life, add items with section: "Friends" (or any name) in assets/data.js. */ ?>
	<div data-list="people"></div>
	<h2>How it connects</h2>
	<div data-edges="people"></div>
</main>
<?php
get_footer();
