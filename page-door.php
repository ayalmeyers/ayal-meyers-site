<?php
/**
 * The door: one text box, nothing else. Behind it, the private area.
 */
get_header( null, array( 'body_class' => 'door' ) );
?>
<main id="door">
	<input id="box" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Text">
	<input id="pw" type="password" autocomplete="current-password" aria-label="Password" hidden>
	<p id="ask" hidden>please type your name, email, and a brief note.</p>
	<form id="request" hidden>
		<input id="r-name" type="text" autocomplete="name" aria-label="Name" placeholder="name" maxlength="120">
		<input id="r-email" type="email" autocomplete="email" aria-label="Email" placeholder="email" maxlength="320">
		<textarea id="r-note" aria-label="Note" placeholder="note" maxlength="4000" rows="3"></textarea>
		<input id="r-pass" type="password" autocomplete="new-password" aria-label="Password" placeholder="password" minlength="8">
		<button type="submit">Send</button>
	</form>
	<p id="msg" aria-live="polite"></p>
</main>

<div id="inside" hidden>
	<div class="in-bar"><a href="<?php echo esc_url( am_url( 'home' ) ); ?>">Ayal Meyers</a><span><span id="who"></span> · <button class="link" id="signout">Sign out</button></span></div>
	<div class="in-main">
		<section id="admin" hidden>
			<h2>Requests</h2>
			<ul id="requests" class="in-list"></ul>
			<h2>Members</h2>
			<ul id="members" class="in-list"></ul>
			<div id="a-thread-wrap" hidden>
				<h2 id="a-thread-name"></h2>
				<ul id="a-thread" class="thread"></ul>
				<form id="a-thread-form" class="row-form"><input name="m" aria-label="Message" placeholder="Message" maxlength="8000"><button>Send</button></form>
			</div>
			<h2>Post</h2>
			<form id="new-post"><textarea name="p" aria-label="New post" rows="4" maxlength="20000"></textarea><button>Post</button></form>
		</section>
		<section>
			<div id="posts"></div>
		</section>
		<section id="thread-mine" hidden>
			<h2>Ayal</h2>
			<ul id="thread" class="thread"></ul>
			<form id="thread-form" class="row-form"><input name="m" aria-label="Message" placeholder="Message" maxlength="8000"><button>Send</button></form>
		</section>
	</div>
</div>
<?php wp_footer(); ?>
</body>
</html>
