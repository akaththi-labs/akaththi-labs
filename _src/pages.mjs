import { enquiry } from "./layout.mjs";

// Closing enquiry block shared by the product pages.
function closing(lead) {
  const e = enquiry();
  return `
    <section class="section section-rule">
      <div class="wrap">
        <div class="prose">
          <h2 class="h2">Ask about this</h2>
          <p>${lead}</p>
          <a class="button" href="${e.href}">Send an enquiry</a>
          ${e.note ? `<p class="note">${e.note}</p>` : ""}
        </div>
      </div>
    </section>`;
}

const managed = {
  slug: "managed-farms",
  path: "/managed-farms/",
  file: "managed-farms/index.html",
  title: "Managed farms",
  description:
    "Akaththi Labs brings its procedures, supplies and operators to a farm in your space. We run it, you sell the produce. Pilot enquiries are open.",
  body: (r) => `
    <section class="wrap head">
      <h1 class="page-title">Managed farms</h1>
      <p class="lead">Advanced farming without building the know-how yourself. We bring our procedures, supply the raw materials and run the farm. You sell the produce.</p>
      <dl class="spec">
        <dt>for</dt><dd>Campuses, offices, kitchens, institutes and brands with space and a market for fresh produce.</dd>
        <dt>status</dt><dd><span class="mono st-design">in design</span>. Pilots start after the <a href="${r}pod/">POD</a> has run reliably on our own farm.</dd>
        <dt>crops</dt><dd>Mushrooms and microgreens first. Saffron once the POD has proven it.</dd>
        <dt>you pay for</dt><dd>Technology, supplies and operations.</dd>
      </dl>
    </section>

    <section class="section">
      <div class="wrap split">
        <h2 class="h2">The problem</h2>
        <ul class="list flush">
          <li>Most new farms fail on know-how, not on ambition: hygiene, spawn and seed handling, timing.</li>
          <li>Good inputs are hard to source on time and at steady quality.</li>
          <li>Building a controlled farm costs a lot before the first sale.</li>
          <li>Hiring and training skilled operators is slow, and they are hard to keep.</li>
        </ul>
      </div>
    </section>

    <section class="section section-rule">
      <div class="wrap split">
        <h2 class="h2">Who does what</h2>
        <div>
          <ol class="steps flush">
            <li><strong>Our procedures.</strong> The standard operating procedures we run our own farm by, and the advanced farming technology behind them.</li>
            <li><strong>Our supplies.</strong> We supply the raw materials and keep the inventory stocked.</li>
            <li><strong>Our operators.</strong> We operate the farm day to day.</li>
            <li><strong>Your market.</strong> You own the harvest and sell it, in your space or your channels.</li>
          </ol>
        </div>
      </div>
    </section>

    <section class="section section-rule">
      <div class="wrap split">
        <h2 class="h2">Before a pilot</h2>
        <div class="prose">
          <p>Food-safety licensing and who is responsible for what are agreed in writing before any pilot starts.</p>
          <p>We start with small pilots and prove each one before adding the next.</p>
        </div>
      </div>
    </section>
${closing("Have space and a market for fresh produce? Tell us where, what you would grow and how much.")}`,
};

const openSource = {
  slug: "open-source",
  path: "/open-source/",
  file: "open-source/index.html",
  title: "Open source",
  description:
    "Akaththi Labs plans to release selected tools around its products as open source. The POD design and the core of Kaani stay closed.",
  body: (r) => `
    <section class="wrap head">
      <h1 class="page-title">Open source</h1>
      <p class="lead">We open the parts that help other builders and keep the product itself closed. Selected tools around the POD and Kaani will be released openly.</p>
      <dl class="spec">
        <dt>status</dt><dd><span class="mono st-planned">planned</span>. Nothing is released yet.</dd>
        <dt>licence</dt><dd>Each project states its own.</dd>
        <dt>code</dt><dd><a href="https://github.com/akaththi-labs">github.com/akaththi-labs</a></dd>
      </dl>
    </section>

    <section class="section">
      <div class="wrap split">
        <h2 class="h2">First candidates</h2>
        <div class="prose">
          <ul class="list flush">
            <li>Sensor drivers and utilities for ESP-IDF.</li>
            <li>An open format for logging cultivation data.</li>
          </ul>
          <p>These are candidates, not commitments. A repository appears here only when there is something to use.</p>
        </div>
      </div>
    </section>

    <section class="section section-rule">
      <div class="wrap split">
        <h2 class="h2">What stays closed</h2>
        <ul class="list flush">
          <li>The POD design.</li>
          <li>The core of Kaani Intelligence.</li>
          <li>Our manufacturing and growing procedures.</li>
        </ul>
      </div>
    </section>

    <section class="section section-rule">
      <div class="wrap split">
        <h2 class="h2">Contributing</h2>
        <div class="prose">
          <p>When a project repository exists, issues and pull requests are welcome there.</p>
        </div>
      </div>
    </section>`,
};

const notFound = {
  slug: "404",
  path: "/404.html",
  file: "404.html",
  root: "base",
  title: "Page not found",
  description: "This page does not exist.",
  body: (r) => `
    <section class="wrap head head-404">
      <h1 class="page-title">Page not found</h1>
      <p class="error-out" aria-hidden="true">$ labs open this-page<br>error: no such page</p>
      <p class="lead">That address does not lead anywhere. Start from the <a href="${r}">home page</a>, or choose a product from the menu.</p>
    </section>`,
};

// The home, POD, Humidifier, Kaani and About pages are built by _site/build.py.
export const PAGES = [managed, openSource, notFound];
