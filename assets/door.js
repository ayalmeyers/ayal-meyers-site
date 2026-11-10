// The door: a single text box. Return clears it.
// The access word opens a request form. An email address or "ADM" asks for a password.
// Approved members and the admin see the private area behind it.
(function () {
  const CFG = window.DOOR_CONFIG || {};
  const sb = window.supabase && CFG.url ? window.supabase.createClient(CFG.url, CFG.key) : null;
  const ADMIN_EMAIL = "ayal@meyerslink.com";
  const WORD = "1d4cd10e3aefad06c97bd8f37b073e99e006aa12cfd9a53df2b195a0c9bb7a24"; // sha-256 of the access word

  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const when = d => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const door = $("#door"), box = $("#box"), ask = $("#ask"), form = $("#request"), pw = $("#pw"), msg = $("#msg"), inside = $("#inside");

  async function sha(s) {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  function say(t) { msg.textContent = t || ""; }
  function reset() { ask.hidden = true; form.hidden = true; pw.hidden = true; pw.value = ""; box.hidden = false; box.value = ""; box.focus(); pending = null; }

  let pending = null; // email waiting for a password

  box.addEventListener("keydown", async e => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const v = box.value.trim();
    box.value = ""; say("");
    if (!v) return;
    if (await sha(v.toLowerCase()) === WORD) {
      box.hidden = true; ask.hidden = false; form.hidden = false; form.querySelector("#r-name").focus();
      return;
    }
    if (!sb) return;
    if (v.toUpperCase() === "ADM") { pending = ADMIN_EMAIL; }
    else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { pending = v.toLowerCase(); }
    else return;
    box.hidden = true; pw.hidden = false; pw.focus();
  });

  pw.addEventListener("keydown", async e => {
    if (e.key === "Escape") return reset();
    if (e.key !== "Enter" || !pending) return;
    e.preventDefault();
    const password = pw.value; pw.value = "";
    if (pending === ADMIN_EMAIL) {
      const { error } = await sb.auth.signInWithPassword({ email: pending, password });
      if (error) { reset(); say("Not recognized."); return; }
      return enter();
    }
    const { data, error } = await sb.rpc("member_login", { p_email: pending, p_password: password });
    if (error || !data) { reset(); say("Not recognized."); return; }
    if (data.status === "pending") { reset(); say("Pending."); return; }
    store.set(data.token);
    enter();
  });

  form.addEventListener("keydown", e => { if (e.key === "Escape") reset(); });
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!sb) return;
    const name = $("#r-name").value.trim(), email = $("#r-email").value.trim().toLowerCase(), note = $("#r-note").value.trim(), password = $("#r-pass").value;
    if (!name || !email || password.length < 8) { say("Name, email, and a password of at least 8 characters."); return; }
    const btn = form.querySelector("button"); btn.disabled = true;
    const { error } = await sb.rpc("request_access", { p_name: name, p_email: email, p_note: note, p_password: password });
    btn.disabled = false;
    if (error) { say("Could not send."); return; }
    form.reset(); reset(); say("Sent.");
  });

  // ---------- inside ----------
  const store = {
    get() { try { return localStorage.getItem("door-token"); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem("door-token", v); } catch (e) {} mem = v; },
    clear() { try { localStorage.removeItem("door-token"); } catch (e) {} mem = null; }
  };
  let mem = store.get(), isAdmin = false;
  const token = () => mem;

  async function enter() {
    const { data: { session } } = await sb.auth.getSession();
    isAdmin = !!session && session.user.email === ADMIN_EMAIL;
    let name = "ADM";
    if (!isAdmin) {
      if (!token()) return;
      const { data, error } = await sb.rpc("member_me", { p_token: token() });
      if (error || !data) { store.clear(); return; }
      name = data.name;
    }
    door.hidden = true; inside.hidden = false; document.body.classList.add("in");
    $("#who").textContent = name;
    $("#admin").hidden = !isAdmin; $("#thread-mine").hidden = isAdmin;
    await Promise.all([loadPosts(), isAdmin ? loadAdmin() : loadThread()]);
  }

  $("#signout").addEventListener("click", async () => {
    if (isAdmin) await sb.auth.signOut();
    else if (token()) { await sb.rpc("member_logout", { p_token: token() }); store.clear(); }
    isAdmin = false; inside.hidden = true; door.hidden = false; document.body.classList.remove("in"); reset();
  });

  async function feed() {
    if (!isAdmin) { const { data } = await sb.rpc("member_feed", { p_token: token() }); return data || []; }
    const { data: posts } = await sb.from("posts").select("id,body,created_at").order("created_at", { ascending: false });
    const { data: comments } = await sb.from("comments").select("id,post_id,author_name,body,created_at").order("created_at");
    return (posts || []).map(p => ({ ...p, comments: (comments || []).filter(c => c.post_id === p.id).map(c => ({ ...c, mine: true })) }));
  }

  async function loadPosts() {
    const posts = await feed();
    $("#posts").innerHTML = posts.map(p => `<article class="post" data-id="${p.id}">
      <div class="post-date">${when(p.created_at)}${isAdmin ? ` · <button class="link" data-del-post="${p.id}">Delete</button>` : ""}</div>
      <div class="post-body">${esc(p.body)}</div>
      <ul class="comments">${(p.comments || []).map(c => `<li><span class="c-name">${esc(c.author_name)}</span> ${esc(c.body)}${c.mine ? ` <button class="link" data-del-comment="${c.id}">Delete</button>` : ""}</li>`).join("")}</ul>
      <form class="comment-form"><input name="c" aria-label="Comment" placeholder="Comment" maxlength="4000"><button>Send</button></form>
    </article>`).join("") || `<p class="quiet">Nothing here yet.</p>`;
  }

  $("#posts").addEventListener("submit", async e => {
    e.preventDefault();
    const f = e.target, body = f.c.value.trim(), post_id = +f.closest(".post").dataset.id;
    if (!body) return;
    const { error } = isAdmin
      ? await sb.from("comments").insert({ post_id, body, author_name: "Ayal" })
      : await sb.rpc("member_comment", { p_token: token(), p_post_id: post_id, p_body: body });
    if (!error) loadPosts();
  });
  $("#posts").addEventListener("click", async e => {
    const p = e.target.dataset.delPost, c = e.target.dataset.delComment;
    if (p && isAdmin) { await sb.from("posts").delete().eq("id", p); loadPosts(); }
    if (c) {
      if (isAdmin) await sb.from("comments").delete().eq("id", c);
      else await sb.rpc("member_delete_comment", { p_token: token(), p_comment_id: +c });
      loadPosts();
    }
  });

  // a member's thread with Ayal, or the admin's thread with one member
  let threadFor = null;
  function drawThread(el, rows) {
    el.innerHTML = (rows || []).map(m => `<li class="${m.from_admin ? "from-a" : "from-m"}"><span class="m-date">${when(m.created_at)}</span>${esc(m.body)}</li>`).join("");
  }
  async function loadThread() {
    if (isAdmin) {
      const { data } = await sb.from("messages").select("from_admin,body,created_at").eq("member_id", threadFor).order("created_at");
      drawThread($("#a-thread"), data);
    } else {
      const { data } = await sb.rpc("member_thread", { p_token: token() });
      drawThread($("#thread"), data);
    }
  }
  $("#thread-form").addEventListener("submit", async e => {
    e.preventDefault(); const body = e.target.m.value.trim(); if (!body) return;
    const { error } = await sb.rpc("member_send", { p_token: token(), p_body: body });
    if (!error) { e.target.reset(); loadThread(); }
  });
  $("#a-thread-form").addEventListener("submit", async e => {
    e.preventDefault(); const body = e.target.m.value.trim(); if (!body || !threadFor) return;
    const { error } = await sb.from("messages").insert({ member_id: threadFor, body, from_admin: true });
    if (!error) { e.target.reset(); loadThread(); }
  });

  // admin
  async function loadAdmin() {
    const { data: ms } = await sb.from("members").select("id,name,email,note,status,created_at").order("created_at", { ascending: false });
    const pend = (ms || []).filter(m => m.status === "pending"), appr = (ms || []).filter(m => m.status === "approved");
    $("#requests").innerHTML = pend.map(m => `<li><div><strong>${esc(m.name)}</strong> · ${esc(m.email)} · ${when(m.created_at)}</div>
      <div class="note">${esc(m.note)}</div><div><button data-approve="${m.id}">Approve</button> <button data-deny="${m.id}">Deny</button></div></li>`).join("") || `<li class="quiet">None.</li>`;
    $("#members").innerHTML = appr.map(m => `<li><button class="link" data-thread="${m.id}">${esc(m.name)}</button> · ${esc(m.email)} · <button class="link" data-deny="${m.id}">Remove</button></li>`).join("") || `<li class="quiet">None.</li>`;
  }
  $("#admin").addEventListener("click", async e => {
    const a = e.target.dataset.approve, d = e.target.dataset.deny, t = e.target.dataset.thread;
    if (a || d) { await sb.from("members").update({ status: a ? "approved" : "denied", decided_at: new Date().toISOString() }).eq("id", a || d); loadAdmin(); }
    if (t) { threadFor = t; $("#a-thread-wrap").hidden = false; $("#a-thread-name").textContent = e.target.textContent; loadThread(); }
  });
  $("#new-post").addEventListener("submit", async e => {
    e.preventDefault();
    const body = e.target.p.value.trim(); if (!body) return;
    const { error } = await sb.from("posts").insert({ body });
    if (!error) { e.target.reset(); loadPosts(); }
  });

  // already signed in from an earlier visit
  if (sb) enter();
  box.focus();
})();
