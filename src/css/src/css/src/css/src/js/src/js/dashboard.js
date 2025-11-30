// PAY54 v6.5 – dashboard.js
// Handles theme, user menu, modals, mock transactions, receipts, etc.

(function () {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeLabel = document.getElementById("themeLabel");
  const userMenuBtn = document.getElementById("userMenuBtn");
  const userDropdown = document.getElementById("userMenuDropdown");
  const toastRoot = document.getElementById("toastRoot");
  const modalRoot = document.getElementById("modalRoot");
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const welcomeName = document.getElementById("welcomeName");
  const userNameLabel = document.getElementById("userNameLabel");

  // --- Session hydrate ---
  const sessionRaw = localStorage.getItem("pay54_session");
  if (sessionRaw) {
    try {
      const s = JSON.parse(sessionRaw);
      if (s.displayName) {
        if (welcomeName) welcomeName.textContent = s.displayName;
        if (userNameLabel) userNameLabel.textContent = s.displayName;
      }
    } catch {}
  }

  // --- Theme toggle ---
  let theme = localStorage.getItem("pay54_theme") || "dark";
  if (theme === "light") {
    body.classList.remove("theme-dark");
  }

  function applyTheme() {
    const isDark = !body.classList.contains("theme-dark");
    if (isDark) {
      body.classList.add("theme-dark");
      themeIcon.textContent = "🌙";
      themeLabel.textContent = "Light";
      localStorage.setItem("pay54_theme", "dark");
    } else {
      body.classList.remove("theme-dark");
      themeIcon.textContent = "☀️";
      themeLabel.textContent = "Dark";
      localStorage.setItem("pay54_theme", "light");
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("theme-dark");
      applyTheme();
    });
    // Ensure labels initialised
    applyTheme();
  }

  // --- User menu ---
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener("click", () => {
      const visible = userDropdown.style.display === "block";
      userDropdown.style.display = visible ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
      if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
        userDropdown.style.display = "none";
      }
    });

    userDropdown.addEventListener("click", (e) => {
      if (e.target.tagName !== "BUTTON") return;
      const action = e.target.dataset.action;
      if (action === "logout") {
        localStorage.removeItem("pay54_session");
        showToast("Logged out of PAY54.", "success");
        setTimeout(() => (window.location.href = "index.html"), 700);
      } else if (action === "support") {
        showToast("Support: chat with us on WhatsApp or email support@pay54.app.");
      } else if (action === "profile") {
        showToast("Profile centre coming in future builds.");
      } else if (action === "settings") {
        showToast("Settings panel coming in future builds.");
      }
    });
  }

  // --- Toast helper ---
  function showToast(message, type = "info") {
    if (!toastRoot) return;
    toastRoot.textContent = message;
    toastRoot.className = "toast toast-visible";
    if (type === "success") toastRoot.classList.add("toast-success");
    if (type === "error") toastRoot.classList.add("toast-error");
    setTimeout(() => {
      toastRoot.classList.remove("toast-visible", "toast-success", "toast-error");
    }, 2500);
  }

  // --- Scroll to top ---
  window.addEventListener("scroll", () => {
    if (!scrollTopBtn) return;
    if (window.scrollY > 280) scrollTopBtn.classList.add("scroll-top-visible");
    else scrollTopBtn.classList.remove("scroll-top-visible");
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // --- Mock transactions ---
  const txList = document.getElementById("transactionsList");
  const mockTx = [
    {
      id: 1,
      type: "sent",
      title: "P2P to @prem54",
      amount: -15000,
      meta: "Today • P2P • Note: Boots",
      status: "Success",
    },
    {
      id: 2,
      type: "received",
      title: "From @mumcare",
      amount: 50000,
      meta: "Yesterday • P2P • Rent support",
      status: "Success",
    },
    {
      id: 3,
      type: "sent",
      title: "PHCN Ikeja Electric",
      amount: -12000,
      meta: "Bills • Electricity • Meter 1038",
      status: "Success",
    },
    {
      id: 4,
      type: "sent",
      title: "Netflix NG",
      amount: -3800,
      meta: "Online • Card • Subscription",
      status: "Success",
    },
  ];

  function formatNaira(n) {
    const sign = n < 0 ? "-" : "";
    const abs = Math.abs(n);
    return sign + "₦" + abs.toLocaleString("en-NG", { minimumFractionDigits: 2 });
  }

  function renderTransactions() {
    if (!txList) return;
    txList.innerHTML = "";
    mockTx.forEach((tx) => {
      const row = document.createElement("div");
      row.className = "tx-item";
      row.innerHTML = `
        <div class="tx-left">
          <div class="tx-badge ${tx.type === "sent" ? "sent" : "received"}">
            ${tx.type === "sent" ? "↗" : "↙"}
          </div>
          <div class="tx-main">
            <span class="tx-title">${tx.title}</span>
            <span class="tx-meta">${tx.meta}</span>
          </div>
        </div>
        <div class="tx-right">
          <span class="tx-amount ${tx.amount < 0 ? "negative" : "positive"}">
            ${formatNaira(tx.amount)}
          </span>
          <span class="tx-status">${tx.status}</span>
        </div>
      `;
      txList.appendChild(row);
    });
  }

  renderTransactions();

  // --- Modal helper ---

  function openModal({ title, bodyHtml, primaryText, onPrimary, secondaryText }) {
    if (!modalRoot) return;
    modalRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-sheet">
          <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close" data-role="close">✕</button>
          </div>
          <div class="modal-body">${bodyHtml}</div>
          <div class="modal-footer">
            ${secondaryText ? `<button class="secondary-button" data-role="secondary">${secondaryText}</button>` : ""}
            ${primaryText ? `<button class="primary-button" data-role="primary">${primaryText}</button>` : ""}
          </div>
        </div>
      </div>
    `;

    const backdrop = modalRoot.querySelector(".modal-backdrop");

    function close() {
      if (backdrop) backdrop.remove();
    }

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop || e.target.dataset.role === "close" || e.target.dataset.role === "secondary") {
        close();
      }
    });

    const primaryBtn = modalRoot.querySelector('[data-role="primary"]');
    if (primaryBtn && onPrimary) {
      primaryBtn.addEventListener("click", () => {
        onPrimary(close);
      });
    }
  }

  // --- Money moves handlers ---

  const sendBtn = document.getElementById("sendMoneyBtn");
  const receiveBtn = document.getElementById("receiveMoneyBtn");
  const addWithdrawBtn = document.getElementById("addWithdrawBtn");
  const bankTransferBtn = document.getElementById("bankTransferBtn");
  const refreshBalanceBtn = document.getElementById("refreshBalanceBtn");

  if (refreshBalanceBtn) {
    refreshBalanceBtn.addEventListener("click", () => {
      showToast("Balance refreshed (mock). In live build this syncs with PAY54 core.", "success");
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      openModal({
        title: "Send Money",
        secondaryText: "Cancel",
        primaryText: "Send",
        bodyHtml: `
          <div class="modal-form-row">
            <label>To (email, phone or @paytag)</label>
            <input id="sendTo" type="text" placeholder="user@pay54.app or @paytag" />
          </div>
          <div class="modal-form-row">
            <label>Amount (₦)</label>
            <input id="sendAmount" type="number" min="0" placeholder="10000" />
          </div>
          <div class="modal-form-row">
            <label>Note (optional)</label>
            <textarea id="sendNote" placeholder="What is this for?"></textarea>
          </div>
          <div class="modal-summary">
            Fee: 0.5% • In production this would show exact fee and total.<br />
            Receipts can be shared via WhatsApp, email or saved as PDF.
          </div>
        `,
        onPrimary(close) {
          const to = document.getElementById("sendTo").value.trim();
          const amount = Number(document.getElementById("sendAmount").value || 0);
          if (!to || !amount) {
            showToast("Enter recipient and amount.", "error");
            return;
          }

          close();
          showReceipt({
            title: "Money Sent",
            amount,
            direction: "-",
            party: to,
            channel: "@paytag / wallet",
          });
        },
      });
    });
  }

  if (receiveBtn) {
    receiveBtn.addEventListener("click", () => {
      const paytag = "@demi54";
      const link = `https://pay54.app/${paytag}`;
      openModal({
        title: "Receive Money",
        secondaryText: "Close",
        primaryText: "Copy link",
        bodyHtml: `
          <p>
            Share your PAY54 paylink or @paytag so the sender can pay you
            via wallet or card.
          </p>
          <div class="modal-form-row">
            <label>Your @paytag</label>
            <input type="text" value="${paytag}" readonly />
          </div>
          <div class="modal-form-row">
            <label>Paylink</label>
            <input type="text" value="${link}" readonly />
          </div>
          <div class="modal-summary">
            In live build you’ll be able to share via WhatsApp, SMS or email
            directly from here.
          </div>
        `,
        onPrimary(close) {
          navigator.clipboard?.writeText(link);
          showToast("Paylink copied (mock).", "success");
          close();
        },
      });
    });
  }

  if (addWithdrawBtn) {
    addWithdrawBtn.addEventListener("click", () => {
      openModal({
        title: "Add / Withdraw",
        secondaryText: "Cancel",
        primaryText: "Confirm",
        bodyHtml: `
          <div class="modal-form-row">
            <label>Action</label>
            <select id="fundAction">
              <option value="add">Add money</option>
              <option value="withdraw">Withdraw</option>
            </select>
          </div>
          <div class="modal-form-row">
            <label>Method</label>
            <select id="fundMethod">
              <option value="card">Linked card</option>
              <option value="bank">Bank account</option>
              <option value="agent">PAY54 Agent</option>
            </select>
          </div>
          <div class="modal-form-row">
            <label>Amount (₦)</label>
            <input id="fundAmount" type="number" min="0" />
          </div>
        `,
        onPrimary(close) {
          const amt = Number(document.getElementById("fundAmount").value || 0);
          if (!amt) {
            showToast("Enter an amount.", "error");
            return;
          }
          close();
          showToast("Funding instruction captured (mock).", "success");
        },
      });
    });
  }

  if (bankTransferBtn) {
    bankTransferBtn.addEventListener("click", () => {
      openModal({
        title: "Bank Transfer (₦)",
        secondaryText: "Cancel",
        primaryText: "Transfer",
        bodyHtml: `
          <div class="modal-form-row">
            <label>Recipient name</label>
            <input id="bankNameRecipient" type="text" placeholder="Account holder" />
          </div>
          <div class="modal-form-row">
            <label>Bank</label>
            <select id="bankName">
              <option value="">Select bank</option>
              <option>Access Bank</option>
              <option>GTBank</option>
              <option>Zenith Bank</option>
              <option>First Bank</option>
              <option>UBA</option>
              <option>Stanbic IBTC</option>
            </select>
          </div>
          <div class="modal-form-row">
            <label>Account number</label>
            <input id="bankAccount" type="text" maxlength="10" />
          </div>
          <div class="modal-form-row">
            <label>Amount (₦)</label>
            <input id="bankAmount" type="number" min="0" />
          </div>
          <div class="modal-form-row">
            <label>Reference</label>
            <input id="bankRef" type="text" placeholder="Rent, fuel, gift…" />
          </div>
        `,
        onPrimary(close) {
          const amt = Number(document.getElementById("bankAmount").value || 0);
          const bank = document.getElementById("bankName").value;
          const acct = document.getElementById("bankAccount").value.trim();
          if (!amt || !bank || acct.length !== 10) {
            showToast("Check bank, account number and amount.", "error");
            return;
          }
          close();
          showReceipt({
            title: "Bank Transfer",
            amount: amt,
            direction: "-",
            party: bank + " • " + acct,
            channel: "NIBSS / NUBAN",
          });
        },
      });
    });
  }

  // --- Services shortcuts ---

  const crossBorderBtn = document.getElementById("crossBorderBtn");
  const savingsBtn = document.getElementById("savingsBtn");
  const billsBtn = document.getElementById("billsBtn");
  const cardsBtn = document.getElementById("cardsBtn");
  const shopBtn = document.getElementById("shopBtn");
  const investBtn = document.getElementById("investBtn");
  const agentBtn = document.getElementById("agentBtn");
  const aiRiskBtn = document.getElementById("aiRiskBtn");

  if (crossBorderBtn) {
    crossBorderBtn.addEventListener("click", () => {
      openModal({
        title: "Cross-Border Remittance",
        secondaryText: "Cancel",
        primaryText: "Preview FX",
        bodyHtml: `
          <div class="modal-form-row">
            <label>You send (₦)</label>
            <input id="fxSend" type="number" min="0" placeholder="250000" />
          </div>
          <div class="modal-form-row">
            <label>Destination</label>
            <select id="fxCountry">
              <option value="UK">United Kingdom (GBP)</option>
              <option value="US">United States (USD)</option>
              <option value="SA">South Africa (ZAR)</option>
              <option value="GH">Ghana (GHS)</option>
            </select>
          </div>
          <div class="modal-form-row">
            <label>Recipient bank (mock)</label>
            <input type="text" placeholder="e.g. GT Bank Ghana" />
          </div>
          <div class="modal-summary">
            In live PAY54 this module plugs into licensed FX partners
            (like NALA/WorldRemit style experience).
          </div>
        `,
        onPrimary(close) {
          const amt = Number(document.getElementById("fxSend").value || 0);
          if (!amt) {
            showToast("Enter an amount to send.", "error");
            return;
          }
          close();
          showToast("FX preview generated (mock).", "success");
        },
      });
    });
  }

  if (savingsBtn) {
    savingsBtn.addEventListener("click", () => {
      openModal({
        title: "Savings & Goals",
        secondaryText: "Close",
        primaryText: "Save goal",
        bodyHtml: `
          <div class="modal-form-row">
            <label>Goal name</label>
            <input id="goalName" type="text" placeholder="Rent, car, travel…" />
          </div>
          <div class="modal-form-row">
            <label>Target amount (₦)</label>
            <input id="goalTarget" type="number" min="0" />
          </div>
          <div class="modal-form-row">
            <label>Standing order (₦ / month)</label>
            <input id="goalSo" type="number" min="0" />
          </div>
          <div class="modal-summary">
            In future builds this will show a list of existing goals and
            a pie-chart of allocations.
          </div>
        `,
        onPrimary(close) {
          const name = document.getElementById("goalName").value.trim();
          if (!name) {
            showToast("Enter a goal name.", "error");
            return;
          }
          close();
          showToast(`Goal "${name}" created (mock).`, "success");
        },
      });
    });
  }

  if (billsBtn) {
    billsBtn.addEventListener("click", () => {
      openModal({
        title: "Bills & Top-Up",
        secondaryText: "Cancel",
        primaryText: "Pay bill",
        bodyHtml: `
          <div class="modal-form-row">
            <label>Bill type</label>
            <select id="billType">
              <option value="electricity">Electricity</option>
              <option value="water">Water</option>
              <option value="dstv">DSTV / TV</option>
              <option value="airtime">Airtime</option>
            </select>
          </div>
          <div class="modal-form-row">
            <label>Account / meter / phone</label>
            <input id="billAccount" type="text" placeholder="Meter or phone number" />
          </div>
          <div class="modal-form-row">
            <label>Amount (₦)</label>
            <select id="billAmount">
              <option value="500">₦500</option>
              <option value="1000">₦1,000</option>
              <option value="1500">₦1,500</option>
              <option value="2000">₦2,000</option>
              <option value="5000">₦5,000</option>
            </select>
          </div>
        `,
        onPrimary(close) {
          close();
          showToast("Bill payment captured (mock).", "success");
        },
      });
    });
  }

  if (cardsBtn) {
    cardsBtn.addEventListener("click", () => {
      openModal({
        title: "Virtual & Linked Cards",
        secondaryText: "Close",
        primaryText: "Add card",
        bodyHtml: `
          <p class="muted">
            Your default PAY54 Virtual Visa will appear here with contactless icon.
          </p>
          <div class="modal-form-row">
            <label>Card number</label>
            <input id="cardNumber" maxlength="16" placeholder="16 digits (mock)" />
          </div>
          <div class="modal-form-row">
            <label>Expiry / CVV</label>
            <input id="cardMeta" placeholder="MM/YY • 3 digits" />
          </div>
        `,
        onPrimary(close) {
          const card = document.getElementById("cardNumber").value.trim();
          if (card.length < 12) {
            showToast("Enter a realistic card number (mock).", "error");
            return;
          }
          close();
          showToast("Card linked (mock). Default card can be changed in future builds.", "success");
        },
      });
    });
  }

  if (shopBtn) {
    shopBtn.addEventListener("click", () => {
      openModal({
        title: "Shop on the Fly",
        secondaryText: "Close",
        primaryText: "Open sample",
        bodyHtml: `
          <p>
            In production this will open affiliate links with PAY54 rails
            (Taxi, Food, Tickets, Shops).
          </p>
          <ul class="modal-summary">
            <li>Taxi: Uber, Bolt</li>
            <li>Food: Jumia Food, KFC, Domino's</li>
            <li>Tickets: cinemas, concerts, football</li>
            <li>Shops: Jiji, eBay, AliExpress, Temu, ASOS</li>
          </ul>
        `,
        onPrimary(close) {
          showToast("Affiliate deep-links to be wired in live environment.", "info");
          close();
        },
      });
    });
  }

  if (investBtn) {
    investBtn.addEventListener("click", () => {
      openModal({
        title: "Investments & Stocks",
        secondaryText: "Close",
        primaryText: "Mock buy AAPL",
        bodyHtml: `
          <p class="muted">
            Prices in USD, pay in USD or NGN. A "My Portfolio" section will
            show purchased assets in a future build.
          </p>
          <div class="modal-form-row">
            <label>Units</label>
            <input id="invUnits" type="number" min="1" value="1" />
          </div>
          <div class="modal-form-row">
            <label>Pay in</label>
            <select id="invCurrency">
              <option value="USD">USD ($)</option>
              <option value="NGN">NGN (₦)</option>
            </select>
          </div>
        `,
        onPrimary(close) {
          const units = Number(document.getElementById("invUnits").value || 1);
          const cur = document.getElementById("invCurrency").value;
          close();
          showReceipt({
            title: "Investment (Mock AAPL)",
            amount: units * 190,
            direction: "-",
            party: "AAPL (Apple Inc.)",
            channel: cur === "USD" ? "Card / FX wallet ($)" : "NGN wallet (FX converted)",
          });
        },
      });
    });
  }

  if (agentBtn) {
    agentBtn.addEventListener("click", () => {
      openModal({
        title: "Become an Agent",
        secondaryText: "Cancel",
        primaryText: "Submit",
        bodyHtml: `
          <div class="modal-form-row">
            <label>Full name</label>
            <input id="agentName" type="text" />
          </div>
          <div class="modal-form-row">
            <label>Business name</label>
            <input id="agentBiz" type="text" />
          </div>
          <div class="modal-form-row">
            <label>NIN (11 digits)</label>
            <input id="agentNin" maxlength="11" />
          </div>
          <div class="modal-form-row">
            <label>Capture selfie (mobile)</label>
            <input id="agentSelfie" type="file" accept="image/*" capture="user" />
          </div>
          <div class="modal-summary">
            In live PAY54, selfie + ID would be uploaded to the KYC provider.
          </div>
        `,
        onPrimary(close) {
          const nin = document.getElementById("agentNin").value.trim();
          if (nin.length !== 11) {
            showToast("NIN must be 11 digits.", "error");
            return;
          }
          close();
          showToast("Agent application submitted (mock).", "success");
        },
      });
    });
  }

  if (aiRiskBtn) {
    aiRiskBtn.addEventListener("click", () => {
      openModal({
        title: "AI Risk Watch",
        secondaryText: "Close",
        primaryText: "",
        bodyHtml: `
          <p>
            AI Risk Watch scans patterns like:
          </p>
          <ul class="modal-summary">
            <li>Unusual location or device fingerprints</li>
            <li>High-value FX outflows above your normal profile</li>
            <li>Multiple failed PIN / biometric attempts</li>
          </ul>
          <p class="muted">
            In production this would block risky flows and ask for extra verification.
          </p>
        `,
      });
    });
  }

  // --- Shared receipt modal ---

  function showReceipt({ title, amount, direction, party, channel }) {
    openModal({
      title: "Receipt",
      secondaryText: "Close",
      primaryText: "Share (mock)",
      bodyHtml: `
        <div class="receipt">
          <h3>${title}</h3>
          <p class="receipt-amount">
            ${direction === "-" ? "−" : "＋"} ${formatNaira(amount)}
          </p>
          <p class="receipt-meta">${party}</p>
          <div class="receipt-split">
            <div class="receipt-split-row">
              <span>Channel</span><span>${channel}</span>
            </div>
            <div class="receipt-split-row">
              <span>Date</span><span>${new Date().toLocaleString()}</span>
            </div>
          </div>
          <p class="muted" style="margin-top:0.5rem;">
            Sharing via WhatsApp / email will be wired once backend is connected.
          </p>
        </div>
      `,
      onPrimary(close) {
        showToast("Receipt share (mock). In live app this opens WhatsApp / email.", "success");
        close();
      },
    });
  }
})();
