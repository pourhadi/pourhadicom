"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const yrEl = document.getElementById("yr");
    if (yrEl) yrEl.textContent = String(new Date().getFullYear());

    /* ===== particle constellation ===== */
    const c = document.getElementById("net") as HTMLCanvasElement | null;
    const x = c?.getContext("2d") ?? null;
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    let w = 0,
      h = 0,
      dpr = 1;
    let pts: { x: number; y: number; vx: number; vy: number }[] = [];
    const mouse = { x: -9999, y: -9999 };
    const ACC = [255, 61, 127] as const;
    let raf = 0;

    function size() {
      if (!c || !x) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = c.getBoundingClientRect();
      w = r.width;
      h = r.height;
      c.width = w * dpr;
      c.height = h * dpr;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(96, Math.floor((w * h) / 12000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
      }));
    }

    function step() {
      if (!x) return;
      x.clearRect(0, 0, w, h);
      const R = 128;
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = mouse.x - p.x,
          dy = mouse.y - p.y,
          d = Math.hypot(dx, dy);
        if (d < 160) {
          const f = ((160 - d) / 160) * 0.04;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= 0.992;
        p.vy *= 0.992;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i],
            b = pts[j],
            dx = a.x - b.x,
            dy = a.y - b.y,
            d = Math.hypot(dx, dy);
          if (d < R) {
            const o = (1 - d / R) * 0.5;
            x.strokeStyle = `rgba(236,236,241,${o * 0.5})`;
            x.lineWidth = 1;
            x.beginPath();
            x.moveTo(a.x, a.y);
            x.lineTo(b.x, b.y);
            x.stroke();
          }
        }
        const a = pts[i],
          mdx = a.x - mouse.x,
          mdy = a.y - mouse.y,
          md = Math.hypot(mdx, mdy);
        if (md < 170) {
          const o = 1 - md / 170;
          x.strokeStyle = `rgba(${ACC[0]},${ACC[1]},${ACC[2]},${o * 0.7})`;
          x.lineWidth = 1;
          x.beginPath();
          x.moveTo(a.x, a.y);
          x.lineTo(mouse.x, mouse.y);
          x.stroke();
        }
      }
      for (const p of pts) {
        const md = Math.hypot(p.x - mouse.x, p.y - mouse.y),
          near = md < 170;
        x.beginPath();
        x.arc(p.x, p.y, near ? 2.4 : 1.5, 0, 7);
        x.fillStyle = near
          ? `rgba(${ACC[0]},${ACC[1]},${ACC[2]},.95)`
          : "rgba(236,236,241,.6)";
        x.fill();
      }
      raf = requestAnimationFrame(step);
    }

    function start() {
      cancelAnimationFrame(raf);
      size();
      if (!reduce) step();
      else {
        step();
        cancelAnimationFrame(raf);
      }
    }

    const onResize = () => start();
    window.addEventListener("resize", onResize);
    const hero = document.querySelector(".hero") as HTMLElement | null;
    const onMove = (e: PointerEvent) => {
      if (!c) return;
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    hero?.addEventListener("pointermove", onMove);
    hero?.addEventListener("pointerleave", onLeave);
    if (c && x) start();

    /* reveals */
    const ro = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            ro.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => ro.observe(el));

    /* benchmarks */
    const benches = [
      { label: "Greenfield System Architecture", dan4: 97, prev: 64 },
      { label: "Aligning Execs, Design & Product", dan4: 95, prev: 41 },
      { label: "Grounding an LLM in Real Data, Not Vibes", dan4: 95, prev: 38 },
      { label: "Growing Engineers Into Leaders", dan4: 93, prev: 66 },
      { label: 'Saying "No" to an Unneeded Microservice', dan4: 99, prev: 12 },
      { label: "Reading the Doc Before the Meeting", dan4: 90, prev: 4 },
    ];
    const be = document.getElementById("bench");
    if (be) {
      be.innerHTML = "";
      benches.forEach((b) => {
        const r = document.createElement("div");
        r.className = "brow";
        r.innerHTML = `<div class="t"><span class="n">${b.label}</span><span class="p">${b.dan4}%</span></div>
    <div class="track"><div class="prevm" style="left:${b.prev}%"></div><div class="fill" data-w="${b.dan4}"></div></div>`;
        be.appendChild(r);
      });
    }
    const bo = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            const f = e.target.querySelector(".fill") as HTMLElement | null;
            if (f) f.style.width = (f.dataset.w ?? "0") + "%";
            bo.unobserve(e.target);
          }
        }),
      { threshold: 0.4 },
    );
    be?.querySelectorAll(".brow").forEach((el) => bo.observe(el));

    /* playground */
    const log = document.getElementById("log");
    const input = document.getElementById("prompt") as HTMLInputElement | null;
    const send = document.getElementById("send");
    if (log) log.innerHTML = "";

    const escapes: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
    };
    function esc(s: string) {
      return s.replace(/[&<>"]/g, (ch) => escapes[ch]);
    }
    function line(role: "u" | "a", text: string) {
      const wEl = document.createElement("div");
      if (role === "u") {
        wEl.className = "u";
        wEl.innerHTML = "&gt; " + esc(text);
      } else {
        wEl.className = "a";
        wEl.innerHTML =
          '<span class="who">dan-4:</span> <span class="out"></span><span class="cur blink">▋</span>';
      }
      log?.appendChild(wEl);
      if (log) log.scrollTop = log.scrollHeight;
      return wEl;
    }
    function reply(q: string) {
      q = q.toLowerCase();
      if (/hire|job|work|available|recruit|cost|price|salary/.test(q))
        return "Accepting inference requests at dan@pourhadi.com. Compensation is negotiable; 'exposure' is not a currency I was trained to accept.";
      if (/web3|crypto|blockchain|nft|decentral|metaverse/.test(q))
        return "That was dan3. dan3 is in a better place now. Mostly LinkedIn.";
      if (/hallucin/.test(q))
        return "I don't hallucinate. I commit confidently and fix forward, like every senior engineer you've ever met.";
      if (
        /architect|system|design system|scale|microservice|infra|platform|monolith/.test(
          q,
        )
      )
        return "Co-architected a platform from an empty repo. The secret to good architecture is deleting the parts you were most proud of.";
      if (
        /exec|stakeholder|leadership|cto|ceo|\bvp\b|director|strategy|roadmap|business|board/.test(
          q,
        )
      )
        return "I translate executive strategy into systems that ship, and engineering reality back into language the C-suite can plan around. Both directions lose nuance; I minimize the loss.";
      if (/design|product|cross.?functional|\bux\b|\bpm\b|designer/.test(q))
        return "I keep design and product rowing the same direction as engineering. When the three disagree, I'm the one in the room who's actually read all three docs.";
      if (/lead|team|manage|mentor|principal|grow|org/.test(q))
        return "I set technical direction with leadership and grow engineers into leaders. The org chart is just another distributed system, and it has worse latency.";
      if (
        /ai|ml|model|patient|symptom|transformer|intake|llm|chatbot|agent|voice|fhir/.test(
          q,
        )
      )
        return "Built complex AI agents from the ground up — a patient assistant grounded in live FHIR records, and a voice agent that runs a support phone line. The model is the easy part; grounding it in real data and shipping it is the job.";
      if (/swift|ios|kotlin|android|react|mobile|native|app/.test(q))
        return "Native iOS and Android — Swift, Kotlin Multiplatform, SwiftUI, Jetpack Compose. I also built the engine that lets design and product update live apps with no App Store release.";
      if (/meeting|email|sync|alignment/.test(q))
        return "This could have been an email. In fairness, most things could have been an email.";
      if (/who|what are you|dan-?4|yourself|about/.test(q))
        return "dan-4. Principal/Lead engineer by Daniel Pourhadi. 13B parameters: most allocated to architecture and stakeholder alignment, the rest to telling you the deadline is optimistic.";
      if (/hi|hello|hey|sup|yo/.test(q))
        return "Hello. You're talking to dan-4. Bring me a system that's on fire, or an exec who wants it yesterday.";
      const fb = [
        "Outside my training distribution, but I'll answer with conviction — see also: my entire career.",
        "dan-4 considered that prompt and elected to remain deadpan.",
        "I could route this to a smaller model, but I mentor those and it'd take it personally.",
        "Insufficient context. Ask me about architecture, working with executives and product, or the AI work.",
      ];
      return fb[Math.floor(Math.random() * fb.length)];
    }

    const intervals: ReturnType<typeof setInterval>[] = [];
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function type(node: HTMLElement, text: string) {
      const out = node.querySelector(".out") as HTMLElement | null;
      const cur = node.querySelector(".cur") as HTMLElement | null;
      let i = 0;
      const t = setInterval(() => {
        if (out) out.textContent = text.slice(0, ++i);
        if (log) log.scrollTop = log.scrollHeight;
        if (i >= text.length) {
          clearInterval(t);
          cur?.remove();
        }
      }, 15);
      intervals.push(t);
    }
    function ask() {
      if (!input) return;
      const q = input.value.trim();
      if (!q) return;
      line("u", q);
      input.value = "";
      const n = line("a", "");
      const to = setTimeout(() => type(n, reply(q)), 300);
      timeouts.push(to);
    }
    const onSend = () => ask();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") ask();
    };
    send?.addEventListener("click", onSend);
    input?.addEventListener("keydown", onKey);

    const greetTo = setTimeout(
      () =>
        type(
          line("a", ""),
          "dan-4 online. Ask about architecture, working with execs and product, or the AI work.",
        ),
      700,
    );
    timeouts.push(greetTo);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      hero?.removeEventListener("pointermove", onMove);
      hero?.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      bo.disconnect();
      send?.removeEventListener("click", onSend);
      input?.removeEventListener("keydown", onKey);
      intervals.forEach((t) => clearInterval(t));
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <>
      <nav>
        <div className="wrap">
          <span className="b">
            dan-4 <span className="dot" style={{ marginLeft: "2px" }}></span>
          </span>
          <a href="#access" className="navbtn">
            request access
          </a>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <canvas id="net"></canvas>
        <div className="inner">
          <span className="pill">
            <span className="dot"></span> A Daniel Pourhadi Foundation Model ·
            v4.0
          </span>
          <h1 className="wm">
            dan<span className="x">-4</span>
          </h1>
          <p className="tag">The most capable Dan to date.</p>
          <p className="lede">
            <b>Principal / Lead engineer.</b> Sets technical direction with
            executives, keeps design and product rowing with engineering, and
            turns &ldquo;what the business actually wants&rdquo; into a system
            that ships. dan3 promised to change the world. dan-4 shipped to
            production.
          </p>
          <div className="cta">
            <a href="#access" className="btn primary">
              Join the waitlist →
            </a>
            <a href="#card" className="btn ghost">
              Read the model card
            </a>
          </div>
        </div>
        <div className="hint lbl">move your cursor · the network responds</div>
      </div>

      <div className="wrap">
        {/* CAPABILITIES */}
        <section>
          <div className="sh reveal">
            <span className="no">01</span>
            <h2>Capabilities</h2>
            <span className="meta">core / 4</span>
          </div>
          <div className="cap reveal">
            <div>
              <div className="ci">Architecture</div>
              <h3>Systems Design</h3>
            </div>
            <p>
              Co-architected an entire platform from an empty repo — Kotlin
              Multiplatform, Micronaut microservices, GraphQL. The kind of
              foundation that&apos;s invisible when it works and named in the
              postmortem when it doesn&apos;t.
            </p>
          </div>
          <div className="cap reveal">
            <div>
              <div className="ci">Leadership</div>
              <h3>Technical Direction</h3>
            </div>
            <p>
              Partners with executives on strategy, keeps design and product
              aligned with engineering reality, and translates &ldquo;the
              business needs synergy&rdquo; into a roadmap that survives contact
              with production. Grows engineers; owns the hard calls.
            </p>
          </div>
          <div className="cap reveal">
            <div>
              <div className="ci">Inference</div>
              <h3>Agent Engineering</h3>
            </div>
            <p>
              Builds complex AI agents from the ground up: a patient-facing
              assistant wired into live FHIR medical records, and a real-time
              voice agent that runs the support phone line. It does AI. It will
              not bolt a chatbot onto your homepage to make the board feel
              current.
            </p>
          </div>
          <div className="cap reveal">
            <div>
              <div className="ci">Alignment</div>
              <h3>Allegedly Aligned</h3>
            </div>
            <p>
              Fine-tuned via RLHF, most of it stakeholder feedback. Declines
              harmful instructions, scope creep, and any meeting that should
              have been an email.
            </p>
          </div>
        </section>

        {/* BENCHMARKS */}
        <section>
          <div className="sh reveal">
            <span className="no">02</span>
            <h2>Benchmarks</h2>
            <span className="meta">DanEval v4</span>
          </div>
          <p
            className="reveal"
            style={{
              color: "var(--soft)",
              fontSize: "14.5px",
              margin: "-22px 0 28px",
            }}
          >
            Evaluated against prior checkpoints and the median engineer. Numbers
            are accurate to within ±100% and were completely cherry-picked.
          </p>
          <div id="bench"></div>
          <p className="bnote reveal">
            DanEval is authored by Dan, peer-reviewed by Dan, and reproduces
            reliably on Dan&apos;s machine.
          </p>
        </section>

        {/* MODEL CARD */}
        <section id="card">
          <div className="sh reveal">
            <span className="no">03</span>
            <h2>Model Card</h2>
            <span className="meta">spec</span>
          </div>
          <div className="mc reveal">
            <div>
              <h4>Specifications</h4>
              <div className="kv">
                <span className="d">parameters</span>
                <span>~13B (years)</span>
              </div>
              <div className="kv">
                <span className="d">role</span>
                <span>Principal / Lead</span>
              </div>
              <div className="kv">
                <span className="d">specialty</span>
                <span>Architecture</span>
              </div>
              <div className="kv">
                <span className="d">base</span>
                <span>Chicago, IL</span>
              </div>
              <div className="kv">
                <span className="d">deployment</span>
                <span>Remote-ready</span>
              </div>
              <div className="kv">
                <span className="d">license</span>
                <span>Hire-only</span>
              </div>
            </div>
            <div>
              <h4>Training Corpus</h4>
              <ul>
                <li>
                  <span className="d">2021–now</span> &nbsp; <b>K Health</b> —
                  co-architected the next-gen platform and led the team building
                  it alongside design and product. Built K&apos;s most complex
                  AI agents — patient-facing and voice — from the ground up.
                </li>
                <li>
                  <span className="d">2020–21</span> &nbsp;{" "}
                  <b>Elevance / Anthem</b> — Principal AI Engineer; shipped a
                  symptom picker to 40M members across two large eng orgs.
                </li>
                <li>
                  <span className="d">2017–20</span> &nbsp; <b>Rocket Wagon</b>{" "}
                  — full-stack consultancy; ML for a wine distributor,
                  battery-life models with Duracell.
                </li>
                <li>
                  <span className="d">2009–12</span> &nbsp;{" "}
                  <b>Chicago City Council</b> — Legislative Aide. The hardest
                  distributed systems run on people.
                </li>
              </ul>
            </div>
            <div>
              <h4>Demonstrated Abilities</h4>
              <ul>
                <li>
                  <b>Server-driven native UI</b> — a Kotlin Multiplatform engine
                  that updates live apps with no App Store release.
                </li>
                <li>
                  <b>PatientGPT</b> — a patient-facing AI agent grounded in each
                  user&apos;s live FHIR records, built from the ground up.
                </li>
                <li>
                  <b>AI voice agent</b> — runs the support phone line: answers
                  questions, books, reschedules and cancels appointments at
                  real-time-voice latency.
                </li>
                <li>
                  <b>ML Trading Platform</b> — LSTM, GRU & transformer models on
                  index futures.
                </li>
                <li>
                  <b>OnCue</b> — top-10 paid music app; first crossfading queue
                  player on the App Store.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* PLAYGROUND */}
        <section>
          <div className="sh reveal">
            <span className="no">04</span>
            <h2>Playground</h2>
            <span className="meta">temp 0.7</span>
          </div>
          <div className="term reveal">
            <div className="tt">
              <span className="d on"></span>
              <span className="d"></span>
              <span className="d"></span>
              <span style={{ marginLeft: "6px" }}>
                dan-4 · system: &ldquo;be helpful, stay deadpan&rdquo;
              </span>
            </div>
            <div className="log" id="log"></div>
            <div className="prow">
              <span className="pr">&gt;</span>
              <input
                id="prompt"
                autoComplete="off"
                placeholder="ask dan-4 anything…"
              />
              <button id="send">run</button>
            </div>
          </div>
          <p className="bnote reveal">
            dan-4 may produce confident outputs that later require a hotfix. Not
            certified for safety-critical systems or standups.
          </p>
        </section>

        {/* ACCESS */}
        <section id="access">
          <div className="access reveal">
            <span className="lbl acc">Limited availability</span>
            <h2>dan-4 is currently deployed.</h2>
            <p>
              Inference capacity is fully allocated to an existing production
              workload. dan-4 maintains a short waitlist and will reprioritize
              for a sufficiently interesting problem.
            </p>
            <div className="cta" style={{ marginTop: "32px" }}>
              <a href="mailto:dan@pourhadi.com" className="btn primary">
                dan@pourhadi.com
              </a>
              <a
                href="https://linkedin.com/in/danpourhadi/"
                className="btn ghost"
              >
                linkedin.com/in/danpourhadi
              </a>
            </div>
            <p className="bnote" style={{ marginTop: "22px" }}>
              Compensation negotiable · a system that&apos;s on fire moves you
              up the queue.
            </p>
          </div>
        </section>

        <footer>
          <span>
            © <span id="yr"></span> Daniel Pourhadi · all weights reserved
          </span>
          <span>
            dan-4 supersedes dan3 — deprecated, still &ldquo;visionary&rdquo; on
            its own LinkedIn
          </span>
        </footer>
      </div>
    </>
  );
}
