<?php
/**
 * Not found.
 */
get_header();
?>
<header data-bar></header>
<main class="notebook">
	<h1>Not found</h1>
	<p>That page doesn't exist. <a href="<?php echo esc_url( am_url( 'home' ) ); ?>">Go home</a>.</p>
</main>
<?php
get_footer();
