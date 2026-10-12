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
  // Official Razorpay Hosted Payment Page / Link URL.
  // Replace with your verified production URL (e.g., https://pages.razorpay.com/nepalrelief2024 or https://rzp.io/l/...)
  razorpayHostedUrl: 'https://pages.razorpay.com/sample-nepal-flood-relief',
  
  // Verification details
  initiativeName: 'Relief Fund — Nepal Flood Emergency Initiative',
  organizerName: '[TODO: Organizer / Coordination Team Name]',
  contactEmail: 'reliefund90@gmail.com',
  
  // Payment behavior
  supportsCustomAmounts: true,
  providerName: 'Razorpay'
};

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
  const donateButtons = document.querySelectorAll('.js-donate-btn');
  const modal = document.getElementById('payment-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');
  const modalTargetUrlText = document.getElementById('modal-target-url');
  const modalAmountVal = document.getElementById('modal-amount-value');

  if (modalTargetUrlText) {
    modalTargetUrlText.textContent = RELIEF_CONFIG.razorpayHostedUrl;
  }

  function openModal(preferredAmount) {
    if (!modal) {
      // Fallback: direct window open if modal is absent
      window.open(RELIEF_CONFIG.razorpayHostedUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const amountNum = preferredAmount ? parseInt(preferredAmount, 10) : currentSelectedAmount;
    if (modalAmountVal && amountNum) {
      modalAmountVal.textContent = `₹${amountNum.toLocaleString('en-IN')}`;
    }

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus confirm button
    if (modalConfirmBtn) modalConfirmBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  donateButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const amount = btn.getAttribute('data-amount') || null;
      openModal(amount);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

  // Close when clicking modal backdrop outside box
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  // Confirm redirect button
  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', () => {
      closeModal();
      window.open(RELIEF_CONFIG.razorpayHostedUrl, '_blank', 'noopener,noreferrer');
    });
  }
}

// Current selected amount state
let currentSelectedAmount = 100;

const AMOUNT_IMPACTS = {
  100: 'Supplies clean drinking water sachets and ORS hydration packets for flood-affected families.',
  250: 'Provides emergency high-energy biscuits, dry rations, and basic hygiene soap.',
  500: 'Supplies water purification tablets & emergency hydration sachets for an affected family.',
  1000: 'Procures 10kg rice, lentils, salt, cooking oil, and nutritious dry rations for a family.',
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

    if (heroDonateBtn) {
      heroDonateBtn.setAttribute('data-amount', String(amount));
    }

    if (donateBtnText) {
      donateBtnText.textContent = `Donate for Their Lives (₹${amount.toLocaleString('en-IN')})`;
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

  // Set default initial state for button text
  if (donateBtnText) {
    donateBtnText.textContent = 'Donate for Their Lives (₹100)';
  }
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
