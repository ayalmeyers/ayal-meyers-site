<?php
/**
 * Modeling page.
 */
get_header();
?>
<header data-bar></header>
<main class="notebook">
	<h1><?php echo esc_html( am_sections()['modeling'][0] ); ?></h1>
	<?php am_intro( 'modeling' ); ?>
	<?php /* Portfolio: replace each canvas with <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/photos/your-photo.jpg" alt="..."> */ ?>
	<div class="frames">
		<canvas data-dots="0" data-kind="cluster" aria-hidden="true"></canvas>
		<canvas data-dots="1" data-kind="wave" aria-hidden="true"></canvas>
		<canvas data-dots="2" data-kind="ring" aria-hidden="true"></canvas>
		<canvas data-dots="3" data-kind="spiral" aria-hidden="true"></canvas>
		<canvas data-dots="4" data-kind="grid" aria-hidden="true"></canvas>
		<canvas data-dots="5" data-kind="sphere" aria-hidden="true"></canvas>
	</div>
	<div data-list="modeling"></div>
	<h2>How it connects</h2>
	<div data-edges="modeling"></div>
</main>
<?php
get_footer();
