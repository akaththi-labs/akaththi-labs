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

const home = {
  slug: "",
  path: "/",
  file: "index.html",
  title: "Automation for living systems",
  description:
    "Akaththi Labs builds machines, software and methods that make biology repeatable. We start with advanced farming: the POD chamber, Kaani Intelligence and managed farms.",
  body: (r) => `
    <section class="wrap hero">
      <p class="eyebrow">Akaththi Labs &middot; Chennai, India</p>
      <h1 class="display">Automation for living systems.</h1>
      <p class="lead">We build the machines, software and methods that make biology repeatable. We start with cultivation. We do not intend to stop there.</p>
      <p class="prompt" aria-hidden="true"><span class="ps">$</span><span class="type">focus: cultivation</span><span class="cursor"></span></p>
    </section>

    <section class="section section-rule" aria-labelledby="horizon-title">
      <div class="wrap">
        <h2 id="horizon-title" class="h2 band-title">Where we are going</h2>
        <div class="horizon">
          <div>
            <p class="when">Now</p>
            <h3 class="h3">Agritech</h3>
            <p>Controlled-environment cultivation. POD, Kaani and managed farms, proven on our own farm first.</p>
            <p class="tag tag-building">building</p>
          </div>
          <div>
            <p class="when">Next</p>
            <h3 class="h3">More crops, more biology</h3>
            <p>New crops, then other controlled-biology work where the same sensing and control apply.</p>
            <p class="tag tag-design">exploring</p>
          </div>
          <div>
            <p class="when">Later</p>
            <h3 class="h3">Life science and health</h3>
            <p>A direction, not a product. When something exists, this page will say so.</p>
            <p class="tag tag-planned">direction</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-rule" aria-labelledby="products-title">
      <div class="wrap">
        <h2 id="products-title" class="h2 band-title">What we are building now</h2>
        <ul class="products">
          <li>
            <a href="${r}pod/">
              <span class="p-no">01</span>
              <span class="p-name">POD 1.0</span>
              <span class="p-what">A climate-controlled cultivation chamber, developed with research partners.</span>
              <span class="tag tag-building">building</span>
            </a>
          </li>
          <li>
            <a href="${r}kaani/">
              <span class="p-no">02</span>
              <span class="p-name">Kaani Intelligence</span>
              <span class="p-what">An intelligent farm operating system, from farm to market.</span>
              <span class="tag tag-building">building</span>
            </a>
          </li>
          <li>
            <a href="${r}managed-farms/">
              <span class="p-no">03</span>
              <span class="p-name">Managed farms</span>
              <span class="p-what">Our procedures, our supplies and our operators on your farm. You sell the produce.</span>
              <span class="tag tag-design">in design</span>
            </a>
          </li>
        </ul>
        <p class="legend"><strong>building</strong> means we are making and testing it on our own farm. <strong>in design</strong> means scoped but not yet offered.</p>
      </div>
    </section>

    <section class="section section-rule" aria-labelledby="crops-title">
      <div class="wrap">
        <h2 id="crops-title" class="h2 band-title">What it grows</h2>
        <div class="crops">
          <div>
            <h3 class="h3">Mushrooms</h3>
            <p>Grown on our own farm today, on the same technology.</p>
          </div>
          <div>
            <h3 class="h3">Microgreens</h3>
            <p>Grown on our own farm today.</p>
          </div>
          <div>
            <h3 class="h3">Saffron</h3>
            <p>Under study for the POD and managed farms. We do not grow it yet.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-rule">
      <div class="wrap split">
        <h2 class="h2">Built on a working farm</h2>
        <div class="prose">
          <p>Everything we make runs on our own farm in Chennai before it goes anywhere else. If it does not hold up there, we do not offer it.</p>
          <p>We say what exists today and what does not. Status labels on this site mean what they say.</p>
        </div>
      </div>
    </section>

    <section class="section section-rule" id="enquire-home">
      <div class="wrap split">
        <h2 class="h2">Who we talk to</h2>
        <div>
          <dl class="audiences">
            <div><dt>Research firms and institutions</dt><dd>Work with us on POD 1.0, or get a POD for teaching or research. Tell us what you want to grow and measure.</dd></div>
            <div><dt>Brands and growers</dt><dd>Steadier supply, from a farm we run for you or technology you run yourself.</dd></div>
            <div><dt>Organisations with space</dt><dd>A working farm on your campus, in your offices or next to your kitchen.</dd></div>
          </dl>
          <a class="button" href="${r}about/#enquire">Send an enquiry</a>
        </div>
      </div>
    </section>`,
};

const pod = {
  slug: "pod",
  path: "/pod/",
  file: "pod/index.html",
  title: "POD 1.0",
  description:
    "POD 1.0 is a modular, climate-controlled cultivation chamber from Akaththi Labs, developed with research partners and tested on our own farm in Chennai.",
  body: (r) => `
    <section class="wrap head">
      <h1 class="page-title">POD 1.0</h1>
      <p class="lead">A modular, climate-controlled chamber for growing crops that a hot, humid climate does not allow. It is built to hold temperature, humidity, fresh air and light inside a narrow window, so each cycle behaves like the last.</p>
      <dl class="spec">
        <dt>for</dt><dd>Our own farm today. Research firms, institutions and growers next.</dd>
        <dt>with</dt><dd>Research firms and institutions, who work with us on POD 1.0.</dd>
        <dt>status</dt><dd><span class="mono st-building">building</span>. POD 1.0 is being tested on our farm in Chennai.</dd>
        <dt>grows</dt><dd>Mushrooms and microgreens on our farm. Saffron is under study.</dd>
        <dt>runs on</dt><dd><a href="${r}kaani/">Kaani Intelligence</a></dd>
        <dt>offered as</dt><dd>Sale or lease. Terms are not set yet.</dd>
      </dl>
    </section>

    <section class="section">
      <div class="wrap split">
        <h2 class="h2">What it is built to do</h2>
        <ul class="list flush">
          <li>Hold a set climate through the day and night without someone adjusting it.</li>
          <li>Record every reading, so one cycle can be compared with the next.</li>
          <li>Show the chamber as it runs, on live dashboards.</li>
          <li>Come as a unit, so capacity grows by adding units.</li>
        </ul>
      </div>
    </section>

    <section class="section section-rule">
      <div class="wrap split">
        <h2 class="h2">Where it stands</h2>
        <div class="prose">
          <p>We are developing POD 1.0 together with research firms and institutions, and testing it on our own farm. If you do research on cultivation, we want to hear from you.</p>
          <p>POD 1.0 is our own production unit. Smaller and larger versions follow once the first one is proven.</p>
          <p>We will publish measured results after a full grow cycle has run without anyone stepping in. We will not publish them before.</p>
          <p>Design details are protected and are not published.</p>
        </div>
      </div>
    </section>
${closing("A research firm or institution interested in POD 1.0, or a grower who wants a POD? Tell us what you want to grow and measure.")}`,
};

const kaani = {
  slug: "kaani",
  path: "/kaani/",
  file: "kaani/index.html",
  title: "Kaani Intelligence",
  description:
    "Kaani Intelligence is the intelligent farm operating system from Akaththi Labs, built to run a farm from the chamber to the market.",
  body: (r) => `
    <section class="wrap head">
      <h1 class="page-title">Kaani Intelligence</h1>
      <p class="lead">An intelligent farm operating system, built to run a farm end to end, from the chamber to the market.</p>
      <dl class="spec">
        <dt>for</dt><dd>Running a <a href="${r}pod/">POD</a> today, and a whole farm over time.</dd>
        <dt>status</dt><dd><span class="mono st-building">building</span>. The chamber control layer and live dashboards come first. The rest is planned.</dd>
        <dt>part of</dt><dd>Akaththi Labs. Kaani is a product line, not a separate company.</dd>
      </dl>
    </section>

    <section class="section">
      <div class="wrap split">
        <h2 class="h2">It starts at the chamber</h2>
        <div>
          <ol class="steps flush">
            <li><strong>Sense.</strong> Sensor nodes read temperature, humidity, CO2 and light.</li>
            <li><strong>Decide.</strong> The controller compares readings with the settings for the crop and its stage.</li>
            <li><strong>Act.</strong> Relays switch cooling, humidifier, fans and lights.</li>
            <li><strong>Record.</strong> Every reading and action is logged for dashboards and later analysis.</li>
          </ol>
        </div>
      </div>
    </section>

    <section class="section section-rule">
      <div class="wrap split">
        <h2 class="h2">What is inside</h2>
        <ul class="list flush">
          <li>Sensor and actuator nodes running firmware on ESP32 microcontrollers.</li>
          <li>An edge controller on Raspberry Pi hardware, next to the chamber.</li>
          <li>Live dashboards for the grower.</li>
          <li>Open standards where they exist, such as MQTT with Sparkplug B.</li>
        </ul>
      </div>
    </section>

    <section class="section section-rule">
      <div class="wrap split">
        <h2 class="h2">Farm to market</h2>
        <div>
          <ul class="list flush">
            <li><span class="mono st-building">building</span> Chamber control and live dashboards.</li>
            <li><span class="mono st-planned">planned</span> Crop cycles and batches, tracked from start to harvest.</li>
            <li><span class="mono st-planned">planned</span> Raw material and inventory records.</li>
            <li><span class="mono st-planned">planned</span> Harvest, packing and sales records, so produce can be traced to the market.</li>
            <li><span class="mono st-planned">planned</span> Models for climate tuning, yield forecasts and contamination detection. They need many logged cycles first.</li>
          </ul>
          <p class="note">Until a grow cycle has run end to end on our farm, we are not publishing performance numbers.</p>
        </div>
      </div>
    </section>
${closing("Want to know whether Kaani fits your setup? Tell us what you grow and what you measure today.")}`,
};

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
          <p>We take on a small number of pilots we can support properly.</p>
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

const about = {
  slug: "about",
  path: "/about/",
  file: "about/index.html",
  title: "About",
  description:
    "Akaththi Labs builds automation and technology for living systems, starting with cultivation. Based in Chennai, India.",
  body: (r) => {
    const e = enquiry();
    return `
    <section class="wrap head">
      <h1 class="page-title">About Akaththi Labs</h1>
      <p class="lead">Akaththi Labs builds automation and technology for living systems. We start with cultivation and are based in Chennai, Tamil Nadu.</p>
    </section>

    <section class="section section-rule">
      <div class="wrap split">
        <h2 class="h2">How we work</h2>
        <ul class="list flush">
          <li>Prove it on our own farm before we offer it.</li>
          <li>Measure before we claim.</li>
          <li>Standard procedures, measured waste, steady improvement.</li>
        </ul>
      </div>
    </section>

    <section class="section section-rule" id="enquire">
      <div class="wrap split">
        <h2 class="h2">Enquiries</h2>
        <div class="prose">
          <p>Tell us who you are, what you want to grow and where. We read every enquiry.</p>
          <a class="button" href="${e.href}">Send an enquiry</a>
          ${e.note ? `<p class="note">${e.note}</p>` : ""}
        </div>
      </div>
    </section>`;
  },
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

export const PAGES = [home, pod, kaani, managed, openSource, about, notFound];
