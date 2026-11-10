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
	<?php am_intro( 'subjects' ); ?>

	<h2 id="neuroscience">Neuroscience</h2>
	<p>How brains build minds. I studied cognitive neuroscience at Berkeley, and the questions I care most about are perception, prediction, emotion, and the body&#039;s part in all of it.</p>
	<h3>How it connects</h3>
	<div data-edges="neuroscience"></div>
	<div data-related="neuroscience"></div>

	<h2 id="consciousness">Consciousness</h2>
	<p>What experience is, and why there is anything it feels like to be me. It&#039;s also the question behind my interest in AI welfare and whether a machine could ever be a moral patient.</p>
	<h3>How it connects</h3>
	<div data-edges="consciousness"></div>
	<div data-related="consciousness"></div>

	<h2 id="politics">Politics</h2>
	<p>How people decide together. I minored in public policy, wrote policy for parliamentarians, and want to study behavioral economics because real decisions rarely follow the models.</p>
	<h3>How it connects</h3>
	<div data-edges="politics"></div>
	<div data-related="politics"></div>

	<h2 id="philosophy">Philosophy</h2>
	<p>The questions underneath the others. I&#039;m working on my own system of belief, and I study how other thinkers built theirs.</p>
	<h3>How it connects</h3>
	<div data-edges="philosophy"></div>
	<div data-related="philosophy"></div>

</main>
<?php
get_footer();
