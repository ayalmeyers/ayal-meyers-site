<?php
/**
 * Any other page or post, in the notebook style.
 */
get_header();
?>
<header data-bar></header>
<main class="notebook">
	<?php if ( have_posts() ) : ?>
		<?php while ( have_posts() ) : the_post(); ?>
			<article>
				<h1><?php the_title(); ?></h1>
				<?php the_content(); ?>
			</article>
		<?php endwhile; ?>
	<?php else : ?>
		<h1>Not found</h1>
		<p>That page doesn't exist. <a href="<?php echo esc_url( am_url( 'home' ) ); ?>">Go home</a>.</p>
	<?php endif; ?>
</main>
<?php
get_footer();
