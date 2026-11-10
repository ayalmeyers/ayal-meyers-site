<?php
/**
 * Modeling page.
 */
get_header();
$d = get_template_directory_uri() . '/assets';
?>
<header data-bar></header>
<main class="notebook wide">
	<h1><?php echo esc_html( am_sections()['modeling'][0] ); ?></h1>
	<dl class="agency">
		<dt>Agency</dt><dd>Wilhelmina</dd>
		<dt>Agent</dt><dd><a href="mailto:Mike.Schepers@wilhelmina.com">Mike.Schepers@wilhelmina.com</a></dd>
	</dl>
	<div class="gallery">
		<a href="<?php echo esc_url( $d ); ?>/photos/street.jpg"><img src="<?php echo esc_url( $d ); ?>/photos/street.jpg" width="1499" height="1000" alt="Ayal Meyers" loading="eager"></a>
		<a href="<?php echo esc_url( $d ); ?>/photos/denim.jpg"><img src="<?php echo esc_url( $d ); ?>/photos/denim.jpg" width="1199" height="1500" alt="Ayal Meyers" loading="eager"></a>
		<a href="<?php echo esc_url( $d ); ?>/photos/blue-tee.jpg"><img src="<?php echo esc_url( $d ); ?>/photos/blue-tee.jpg" width="1200" height="1500" alt="Ayal Meyers" loading="eager"></a>
		<a href="<?php echo esc_url( $d ); ?>/photos/grey-blazer.jpg"><img src="<?php echo esc_url( $d ); ?>/photos/grey-blazer.jpg" width="1200" height="1500" alt="Ayal Meyers" loading="lazy"></a>
		<a href="<?php echo esc_url( $d ); ?>/photos/stripes.jpg"><img src="<?php echo esc_url( $d ); ?>/photos/stripes.jpg" width="1280" height="1600" alt="Ayal Meyers" loading="lazy"></a>
		<a href="<?php echo esc_url( $d ); ?>/photos/arcteryx-beta-1.jpg"><img src="<?php echo esc_url( $d ); ?>/photos/arcteryx-beta-1.jpg" width="1263" height="1600" alt="Ayal Meyers" loading="lazy"></a>
		<a href="<?php echo esc_url( $d ); ?>/photos/arcteryx-beta-2.jpg"><img src="<?php echo esc_url( $d ); ?>/photos/arcteryx-beta-2.jpg" width="1263" height="1600" alt="Ayal Meyers" loading="lazy"></a>
		<a href="<?php echo esc_url( $d ); ?>/photos/arcteryx-atom-1.jpg"><img src="<?php echo esc_url( $d ); ?>/photos/arcteryx-atom-1.jpg" width="1263" height="1600" alt="Ayal Meyers" loading="lazy"></a>
		<a href="<?php echo esc_url( $d ); ?>/photos/arcteryx-atom-2.jpg"><img src="<?php echo esc_url( $d ); ?>/photos/arcteryx-atom-2.jpg" width="1263" height="1600" alt="Ayal Meyers" loading="lazy"></a>
		<a href="<?php echo esc_url( $d ); ?>/photos/arcteryx-atom-3.jpg"><img src="<?php echo esc_url( $d ); ?>/photos/arcteryx-atom-3.jpg" width="1263" height="1600" alt="Ayal Meyers" loading="lazy"></a>
		<a href="<?php echo esc_url( $d ); ?>/photos/arcteryx-set-1.jpg"><img src="<?php echo esc_url( $d ); ?>/photos/arcteryx-set-1.jpg" width="768" height="1024" alt="Ayal Meyers" loading="lazy"></a>
		<a href="<?php echo esc_url( $d ); ?>/photos/arcteryx-set-2.jpg"><img src="<?php echo esc_url( $d ); ?>/photos/arcteryx-set-2.jpg" width="768" height="1024" alt="Ayal Meyers" loading="lazy"></a>
	</div>
</main>
<?php
get_footer();
