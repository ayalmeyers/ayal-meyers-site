<?php
/**
 * Home page: particle intro, then the notebook.
 */
get_header();
$u = 'am_url';
?>
<section class="hero">
	<div class="stage">
		<canvas aria-hidden="true"></canvas>
		<header class="top" data-bar-plain></header>
		<div class="step" data-range="0.12,0.37"><p>I studied cognitive neuroscience at Berkeley. <span class="dim">Now I write, model, and work in AI and strategic communication in New York.</span></p></div>
		<div class="step" data-range="0.76,1"><p>The rest of the time I'm outside. <span class="dim">Surfing, skiing, and walking mountains.</span> <a href="<?php echo esc_url( $u( 'world' ) ); ?>">Exploring our world</a></p></div>
		<div class="scroll-hint">Scroll</div>
	</div>
</section>
<main class="notebook">
	<h1><?php echo esc_html( get_bloginfo( 'name' ) ); ?></h1>
	<div class="intro">
		<div>
			<p>I studied <a href="<?php echo esc_url( $u( 'subjects' ) ); ?>#neuroscience">cognitive neuroscience</a> at UC Berkeley, with a minor in public <a href="<?php echo esc_url( $u( 'subjects' ) ); ?>#politics">policy</a>. I live in New York, where I work in AI and strategic communication and model with <a href="<?php echo esc_url( $u( 'modeling' ) ); ?>">Wilhelmina Sports</a>.</p>
			<p>Most of my time goes to four questions: how the brain works, what <a href="<?php echo esc_url( $u( 'subjects' ) ); ?>#consciousness">consciousness</a> is, how people decide together, and what I actually <a href="<?php echo esc_url( $u( 'subjects' ) ); ?>#philosophy">believe</a>. The rest goes to <a href="<?php echo esc_url( $u( 'writing' ) ); ?>">writing</a>, <a href="<?php echo esc_url( $u( 'books' ) ); ?>">books</a>, <a href="<?php echo esc_url( $u( 'music' ) ); ?>">music</a>, <a href="<?php echo esc_url( $u( 'art' ) ); ?>">art and design</a>, <a href="<?php echo esc_url( $u( 'people' ) ); ?>">people</a>, and <a href="<?php echo esc_url( $u( 'world' ) ); ?>">getting outside</a>.</p>
			<p>All of it is connected. <a href="<?php echo esc_url( $u( 'connections' ) ); ?>">See how</a>, or browse by <a href="<?php echo esc_url( $u( 'subjects' ) ); ?>">subject</a>.</p>
		</div>
		<aside class="side">
			<?php /* Portrait: replace the canvas with <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/portrait.jpg" alt="Ayal Meyers"> */ ?>
			<canvas data-dots="0" data-kind="sphere" aria-hidden="true"></canvas>
			<div class="lbl">Subjects</div>
			<p><a href="<?php echo esc_url( $u( 'subjects' ) ); ?>#neuroscience">neuroscience</a>, <a href="<?php echo esc_url( $u( 'subjects' ) ); ?>#consciousness">consciousness</a>, <a href="<?php echo esc_url( $u( 'subjects' ) ); ?>#politics">politics</a>, <a href="<?php echo esc_url( $u( 'subjects' ) ); ?>#philosophy">philosophy</a></p>
			<hr>
			<p><a href="<?php echo esc_url( $u( 'connections' ) ); ?>">Connections</a> · <a href="<?php echo esc_url( $u( 'world' ) ); ?>">Exploring our world</a> · <a href="<?php echo esc_url( $u( 'people' ) ); ?>">People</a></p>
		</aside>
	</div>
</main>
<?php
get_footer();
