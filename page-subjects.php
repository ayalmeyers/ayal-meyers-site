<?php
/**
 * Subjects page.
 */
get_header();
?>
<header data-bar></header>
<main class="notebook">
	<h1><?php echo esc_html( am_sections()['subjects'][0] ); ?></h1>
	<p class="jump"><a href="#neuroscience">Neuroscience</a> · <a href="#consciousness">Consciousness</a> · <a href="#politics">Politics</a> · <a href="#philosophy">Philosophy</a></p>
	<h2 id="neuroscience">Neuroscience</h2>
	<h2 id="consciousness">Consciousness</h2>
	<h2 id="politics">Politics</h2>
	<h2 id="philosophy">Philosophy</h2>
</main>
<?php
get_footer();
