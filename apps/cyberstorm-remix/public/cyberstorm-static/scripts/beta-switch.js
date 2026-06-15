// Site-switch button loaded only by the legacy Django site (old.thunderstore.io)
// via its DynamicHTML entry; served from the new site's cyberstorm-static. The
// new Cyberstorm site renders its own "Switch to legacy" button natively in
// React (Navigation.tsx) — injecting a foreign button into a React-owned
// container leaked event listeners. The logic stays bidirectional so the file
// is correct whichever host loads it.
function switchSite(newSite, oldSite) {
  const onOldSite = window.location.hostname === oldSite.hostname;
  const target = onOldSite ? newSite : oldSite;
  // Keep the path; search params don't map cleanly between the two sites.
  window.location.assign(
    `${target.protocol}${target.hostname}${target.port !== "" ? ":" : ""}${
      target.port
    }${window.location.pathname}`
  );
}

function buildSwitchButton(newSite, oldSite) {
  const onOldSite = window.location.hostname === oldSite.hostname;
  const switchButton = document.createElement("button");

  if (onOldSite) {
    // Legacy Django site: match the Bootstrap navbar links.
    switchButton.setAttribute(
      "style",
      "display:flex;align-items:center;gap:10px;color:#FFF;font-family:Lato;font-size:15px;font-style:normal;font-weight:400;fill:#FFF;background:transparent;border-width:0px;flex-wrap:nowrap;white-space:nowrap;"
    );
    switchButton.setAttribute("class", "nav-link");
  } else {
    // New Cyberstorm site: match the Nimbus nav.
    switchButton.setAttribute(
      "style",
      "display:flex;height:30px;padding: 0px 12px;justify-content:center;align-items:center;gap:12px;color:#F5F5F6;font-family:Inter;font-size:12px;font-style:normal;font-weight:700;line-height:normal;fill:#49B5F7;background:transparent;"
    );
  }

  switchButton.onclick = () => switchSite(newSite, oldSite);
  switchButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:inherit;height:16px;width:16px;"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 0L160 0 128 0C110.3 0 96 14.3 96 32s14.3 32 32 32l0 132.8c0 11.8-3.3 23.5-9.5 33.5L10.3 406.2C3.6 417.2 0 429.7 0 442.6C0 480.9 31.1 512 69.4 512l309.2 0c38.3 0 69.4-31.1 69.4-69.4c0-12.8-3.6-25.4-10.3-36.4L329.5 230.4c-6.2-10.1-9.5-21.7-9.5-33.5L320 64c17.7 0 32-14.3 32-32s-14.3-32-32-32L288 0zM192 196.8L192 64l64 0 0 132.8c0 23.7 6.6 46.9 19 67.1L309.5 320l-171 0L173 263.9c12.4-20.2 19-43.4 19-67.1z"/></svg> Switch to ${
    onOldSite ? "new" : "legacy"
  }`;

  return switchButton;
}

function insertSwitchButton(newSite, oldSite) {
  const mobileEl = document.querySelector("#nimbusBetaMobile");
  if (mobileEl) {
    mobileEl.appendChild(buildSwitchButton(newSite, oldSite));
  }

  const el = document.querySelector("#nimbusBeta");
  if (el) {
    el.appendChild(buildSwitchButton(newSite, oldSite));
  } else {
    console.error(
      "Couldn't insert site switch, because the container element doesn't exist"
    );
  }
}

function hasBrowserGlobals() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function initSiteSwitch() {
  if (!hasBrowserGlobals()) {
    return;
  }

  const globalWindow = window;
  const initFlag = "__thunderstore_beta_switch_initialized__";
  if (globalWindow[initFlag]) {
    return;
  }
  globalWindow[initFlag] = true;

  const newProd = {
    protocol: "https://",
    hostname: "thunderstore.io",
    port: "",
    tld: "io",
  };
  const oldProd = {
    protocol: "https://",
    hostname: "old.thunderstore.io",
    port: "",
    tld: "io",
  };
  const newQA = {
    protocol: "https://",
    hostname: "thunderstore.dev",
    port: "",
    tld: "dev",
  };
  const oldQA = {
    protocol: "https://",
    hostname: "old.thunderstore.dev",
    port: "",
    tld: "dev",
  };
  const newDev = {
    protocol: "http://",
    hostname: "thunderstore.localhost",
    port: "",
    tld: "localhost",
  };
  const oldDev = {
    protocol: "http://",
    hostname: "old.thunderstore.localhost",
    port: "",
    tld: "localhost",
  };

  // Pick the environment by TLD; both sites share it (.io / .dev / .localhost).
  const host = window.location.hostname;
  const newSite = host.endsWith(newProd.tld)
    ? newProd
    : host.endsWith(newQA.tld)
      ? newQA
      : newDev;
  const oldSite = host.endsWith(oldProd.tld)
    ? oldProd
    : host.endsWith(oldQA.tld)
      ? oldQA
      : oldDev;

  function insertSwitchButtonListener() {
    insertSwitchButton(newSite, oldSite);
    document.removeEventListener(
      "DOMContentLoaded",
      insertSwitchButtonListener
    );
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    insertSwitchButton(newSite, oldSite);
  } else {
    document.addEventListener("DOMContentLoaded", insertSwitchButtonListener);
  }
}

initSiteSwitch();
