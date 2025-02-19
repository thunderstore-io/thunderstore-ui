const enabledPages = ["/communities", "c/[^/]+/?$"];

type UrlStructure = {
  protocol: string;
  hostname: string;
  port: string;
};

const legacyProd: UrlStructure = {
  protocol: "https://",
  hostname: "thunderstore.io",
  port: "",
};

const betaProd: UrlStructure = {
  protocol: "https://",
  hostname: "new.thunderstore.io",
  port: "",
};

const legacyQA: UrlStructure = {
  protocol: "https://",
  hostname: "thunderstore.dev",
  port: "",
};

const betaQA: UrlStructure = {
  protocol: "https://",
  hostname: "new.thunderstore.dev",
  port: "",
};

const legacyDev: UrlStructure = {
  protocol: "http://",
  hostname: "thunderstore.temp",
  port: "",
};

const betaDev: UrlStructure = {
  protocol: "http://",
  hostname: "new.thunderstore.temp",
  port: "",
};

async function checkBetaRedirect(legacy: UrlStructure, beta: UrlStructure) {
  let switchProject = legacy;

  if (window.location.hostname === beta.hostname) {
    switchProject = legacy;
  } else if (window.location.hostname === legacy.hostname) {
    switchProject = beta;
  }

  // Don't include the search params as those differ in projects and are not handled gracefully
  window.location.assign(
    `${switchProject.protocol}${switchProject.hostname}${
      switchProject.port !== "" ? ":" : ""
    }${switchProject.port}${window.location.pathname}`
  );
}

async function insertSwitchButton(legacy: UrlStructure, beta: UrlStructure) {
  let betaIsAvailable = false;
  enabledPages.forEach((regPath) => {
    const regExecuted = new RegExp(regPath).exec(window.location.pathname);
    const found = regExecuted !== null && regExecuted.length < 2;
    if (!betaIsAvailable && found) {
      betaIsAvailable = true;
    }
  });

  if (betaIsAvailable) {
    const switchButton = document.createElement("button");

    if (window.location.hostname === legacy.hostname) {
      switchButton.setAttribute(
        "style",
        "display:flex;align-items:center;gap:10px;color:#FFF;font-family:Lato;font-size:15px;font-style:normal;font-weight:400;line-height:normal;fill:#FFF;background:transparent;border-width:0px;flex-wrap:nowrap;text-wrap-mode:nowrap;padding:0.5rem 2rem;"
      );
    } else {
      switchButton.setAttribute(
        "style",
        "display:flex;height:30px;padding: 0px 12px;justify-content:center;align-items:center;gap:12px;color:#F5F5F6;font-family:Inter;font-size:12px;font-style:normal;font-weight:700;line-height:normal;fill:#49B5F7;background:transparent;"
      );
    }
    switchButton.onclick = async () => {
      checkBetaRedirect(legacy, beta);
    };

    switchButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:inherit;height:16px;width:16px;"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 0L160 0 128 0C110.3 0 96 14.3 96 32s14.3 32 32 32l0 132.8c0 11.8-3.3 23.5-9.5 33.5L10.3 406.2C3.6 417.2 0 429.7 0 442.6C0 480.9 31.1 512 69.4 512l309.2 0c38.3 0 69.4-31.1 69.4-69.4c0-12.8-3.6-25.4-10.3-36.4L329.5 230.4c-6.2-10.1-9.5-21.7-9.5-33.5L320 64c17.7 0 32-14.3 32-32s-14.3-32-32-32L288 0zM192 196.8L192 64l64 0 0 132.8c0 23.7 6.6 46.9 19 67.1L309.5 320l-171 0L173 263.9c12.4-20.2 19-43.4 19-67.1z"/></svg> Switch to ${
      window.location.hostname === legacy.hostname ? "beta" : "legacy"
    }`;

    const el = document.querySelector("#nimbusBeta");
    if (el) {
      el.appendChild(switchButton);
    } else {
      console.error(
        "Couldn't insert beta switch, because the container element doesn't exist"
      );
    }
  }
}

const legacy =
  window.location.hostname === legacyProd.hostname
    ? legacyProd
    : window.location.hostname === legacyQA.hostname
      ? legacyQA
      : legacyDev;
const beta =
  window.location.hostname === betaProd.hostname
    ? betaProd
    : window.location.hostname === betaQA.hostname
      ? betaQA
      : betaDev;

async function insertSwitchButtonListener() {
  insertSwitchButton(legacy, beta);
  document.removeEventListener("DOMContentLoaded", insertSwitchButtonListener);
}

// Run above code
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  insertSwitchButton(legacy, beta);
} else {
  document.addEventListener("DOMContentLoaded", insertSwitchButtonListener);
}
