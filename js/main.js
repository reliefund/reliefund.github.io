/**
 * NEPAL FLOOD RELIEF — CLIENT SCRIPT
 * Standards: Pure Vanilla JS, Strict Mode, Full Accessibility (WCAG 2.1 AA)
 * Payment Security: Never exposes keys or credentials. Routes only to official hosted Razorpay page.
 */

'use strict';

// -----------------------------------------------------------------------------
// 1. Central Configuration
// -----------------------------------------------------------------------------
const RELIEF_CONFIG = {
  // Official Razorpay Hosted Payment Page URL.
  // Using direct hosted page URL ensures the ?amount= parameter is pre-filled.
  razorpayHostedUrl: 'https://pages.razorpay.com/reliefund',
  razorpayShortUrl: 'https://rzp.io/rzp/reliefund',
  
  // Verification details & Transparency
  initiativeName: 'Relief Fund — Nepal Flood Emergency Initiative',
  organizerName: 'Nepal Volunteer Coordination Network',
  merchantAccountName: 'A GHOSH FUNDS',
  merchantLocation: 'Ranaghat, West Bengal, India',
  contactEmail: 'reliefund90@gmail.com',
  
  // Payment behavior
  supportsCustomAmounts: true,
  providerName: 'Razorpay'
};

// Helper to construct official payment URL with pre-filled amount
function getPaymentUrl(amount) {
  const amt = amount || currentSelectedAmount || 100;
  return `${RELIEF_CONFIG.razorpayHostedUrl}?amount=${amt}`;
}

// -----------------------------------------------------------------------------
// 2. Initialization on DOMContentLoaded
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initFaqAccordion();
  initDonationRouting();
  initAmountSelector();
  initSmoothScrollFocus();
  initVerificationNotice();
});

// -----------------------------------------------------------------------------
// 3. Mobile Navigation Drawer
// -----------------------------------------------------------------------------
function initMobileNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!menuToggle || !mobileNav) return;

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !mobileNav.classList.contains('is-open');
    mobileNav.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    
    // Prevent background scrolling while open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', () => toggleMenu());

  // Close when clicking any nav link
  const navLinks = mobileNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      toggleMenu(false);
      menuToggle.focus();
    }
  });
}

// -----------------------------------------------------------------------------
// 4. Accessible FAQ Accordion
// -----------------------------------------------------------------------------
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.js-faq-toggle');

  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const answerId = button.getAttribute('aria-controls');
      const answerElement = document.getElementById(answerId);
      const parentItem = button.closest('.faq-item');

      if (!answerElement || !parentItem) return;

      // Toggle current item
      const nextState = !isExpanded;
      button.setAttribute('aria-expanded', String(nextState));
      parentItem.classList.toggle('is-open', nextState);

      // Optional: update icon accessibility
      const icon = button.querySelector('.faq-icon');
      if (icon) {
        icon.setAttribute('aria-hidden', 'true');
      }
    });
  });
}

// -----------------------------------------------------------------------------
// 5. Razorpay Donation Routing & Pre-Payment Modal
// -----------------------------------------------------------------------------
function initDonationRouting() {
  const heroDonateBtn = document.getElementById('hero-donate-btn');
  const donateButtons = document.querySelectorAll('.js-donate-btn');
  const modal = document.getElementById('payment-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');
  const modalAmountVal = document.getElementById('modal-amount-value');
  const modalPayBtnText = document.getElementById('modal-pay-btn-text');

  function openModal(preferredAmount) {
    if (!modal) {
      window.location.href = getPaymentUrl(preferredAmount || currentSelectedAmount);
      return;
    }

    const amountNum = preferredAmount ? parseInt(preferredAmount, 10) : currentSelectedAmount;
    if (modalAmountVal && amountNum) {
      modalAmountVal.textContent = `₹${amountNum.toLocaleString('en-IN')}`;
    }
    if (modalPayBtnText && amountNum) {
      modalPayBtnText.textContent = `Proceed to Pay ₹${amountNum.toLocaleString('en-IN')} via Razorpay →`;
    }

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (modalConfirmBtn) modalConfirmBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // 1. Primary Hero Donate Button: DIRECT 1-TAP PAYMENT (Frictionless & Seamless)
  if (heroDonateBtn) {
    heroDonateBtn.setAttribute('href', getPaymentUrl(currentSelectedAmount));
    heroDonateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = getPaymentUrl(currentSelectedAmount);
    });
  }

  // 2. Navigation & Drawer Buttons: Scroll smoothly to the donation amount selection card
  donateButtons.forEach(btn => {
    if (btn === heroDonateBtn) return;
    btn.setAttribute('href', '#donation-card');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = document.getElementById('donation-card');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = getPaymentUrl(currentSelectedAmount);
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', () => {
      closeModal();
      window.location.href = getPaymentUrl(currentSelectedAmount);
    });
  }
}

// Current selected amount state
let currentSelectedAmount = 100;

const AMOUNT_IMPACTS = {
  50: 'Supplies clean drinking water sachets and emergency ORS hydration packets for flood victims.',
  100: 'Supplies chlorine water purification tablets & emergency hydration sachets for an affected family.',
  250: 'Provides emergency high-energy biscuits, dry rations, and basic hygiene soap.',
  500: 'Provides essential family survival grain pack (rice, lentils, cooking oil, and salt).',
  1000: 'Procures 10kg staple grain kit, nutrition packs & medical first-aid supplies.',
  2500: 'Provides emergency food pack, waterproof shelter tarpaulin, and warm wool blankets.'
};

// -----------------------------------------------------------------------------
// 6. Interactive Amount Selector (Matches Reference UI Card)
// -----------------------------------------------------------------------------
function initAmountSelector() {
  const amountButtons = document.querySelectorAll('.amount-btn');
  const customBtn = document.getElementById('custom-amount-btn');
  const customPanel = document.getElementById('custom-amount-panel');
  const customInput = document.getElementById('custom-amount-input');
  const hintElement = document.getElementById('amount-impact-hint');
  const heroDonateBtn = document.getElementById('hero-donate-btn');
  const donateBtnText = document.getElementById('donate-btn-text');

  function updateSelection(amount, isCustom = false) {
    currentSelectedAmount = amount;

    amountButtons.forEach(btn => {
      const btnVal = btn.getAttribute('data-amount') ? parseInt(btn.getAttribute('data-amount'), 10) : null;
      let isSelected = false;

      if (isCustom) {
        isSelected = btn.id === 'custom-amount-btn';
      } else {
        isSelected = btnVal === amount;
      }

      btn.classList.toggle('is-selected', isSelected);
      btn.setAttribute('aria-checked', String(isSelected));
    });

    if (customPanel) {
      customPanel.style.display = isCustom ? 'block' : 'none';
      if (isCustom && customInput) {
        customInput.focus();
      }
    }

    const payUrl = getPaymentUrl(amount);

    if (heroDonateBtn) {
      heroDonateBtn.setAttribute('data-amount', String(amount));
      heroDonateBtn.setAttribute('href', payUrl);
    }

    document.querySelectorAll('.js-donate-btn').forEach(btn => {
      btn.setAttribute('href', payUrl);
    });

    if (donateBtnText) {
      donateBtnText.textContent = `Pay ₹${amount.toLocaleString('en-IN')} via Razorpay (UPI / GPay / Cards) →`;
    }

    const modalPayBtnText = document.getElementById('modal-pay-btn-text');
    if (modalPayBtnText) {
      modalPayBtnText.textContent = `Proceed to Pay ₹${amount.toLocaleString('en-IN')} via Razorpay →`;
    }

    if (hintElement) {
      const desc = AMOUNT_IMPACTS[amount] || 'Direct community relief contribution pooled for essential emergency food, water, and shelter.';
      hintElement.innerHTML = `<strong>Selected: ₹${amount.toLocaleString('en-IN')}</strong> — ${desc}`;
    }
  }

  amountButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.id === 'custom-amount-btn') {
        const existingVal = customInput && customInput.value ? parseInt(customInput.value, 10) : 5000;
        updateSelection(existingVal, true);
      } else {
        const amount = parseInt(btn.getAttribute('data-amount'), 10);
        if (amount) updateSelection(amount, false);
      }
    });
  });

  if (customInput) {
    customInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (val && val > 0) {
        updateSelection(val, true);
      }
    });
  }

  // Set default initial state for button text and target URL
  updateSelection(100, false);
}

// -----------------------------------------------------------------------------
// 7. Accessible Smooth Scroll with Focus Management
// -----------------------------------------------------------------------------
function initSmoothScrollFocus() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        // Allow smooth scroll to occur
        targetEl.scrollIntoView({ behavior: 'smooth' });

        // Update keyboard focus for screen readers without jump
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }
    });
  });
}

// -----------------------------------------------------------------------------
// 8. Transparency Notice Logging
// -----------------------------------------------------------------------------
function initVerificationNotice() {
  console.info(
    `[Nepal Flood Relief] Frontend initialized.\n` +
    `• Independent initiative without unverified legal claims.\n` +
    `• Razorpay checkout destination: ${RELIEF_CONFIG.razorpayHostedUrl}\n` +
    `• Zero client-side card handling. No credentials stored.`
  );
}
