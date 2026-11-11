<?php
/**
 * Music page. Hover a cover to hear a preview.
 */
get_header();
?>
<header data-bar></header>
<main class="notebook wide">
	<h1><?php echo esc_html( am_sections()['music'][0] ); ?></h1>
	<ul class="songs" id="songs"></ul>
</main>
<?php
get_footer();
