<?php
/**
 * People page.
 */
get_header();
?>
<header data-bar></header>
<main class="notebook">
	<h1><?php echo esc_html( am_sections()['people'][0] ); ?></h1>
</main>
<?php
get_footer();
