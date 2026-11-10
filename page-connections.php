<?php
/**
 * Connections page: the map stays fixed while each connection is written out beside it.
 */
get_header( null, array( 'body_class' => 'night' ) );
?>
<header data-bar></header>
<div class="conn">
	<div class="map"><canvas aria-label="Map of how the parts of my life and thinking connect. Each connection is written out alongside."></canvas></div>
	<div class="text">
		<p class="lead">Everything I do connects to something else. <span class="dim">Scroll through the connections. Each one lights up on the map as you read it. Hover any label to see everything it touches, or click it to go there.</span></p>
		<div id="links"></div>
		<p class="end">That's the map so far. It grows as I do. <a href="<?php echo esc_url( am_url( 'home' ) ); ?>">Back home</a></p>
	</div>
</div>
<?php
get_footer();
