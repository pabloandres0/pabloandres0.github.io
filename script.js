// Mobile menu navigation toggle
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

if (typeof lightbox !== 'undefined') {
    lightbox.option({
        fadeDuration: 0,
        imageFadeDuration: 0,
        resizeDuration: 0,
        wrapAround: true
    });
}

const toggleNavbar = () => {
    if (!menuIcon || !navbar) return;
    menuIcon.classList.toggle('bx-menu');
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
    menuIcon.setAttribute('aria-expanded', navbar.classList.contains('active'));
};

if (menuIcon && navbar) {
    menuIcon.onclick = toggleNavbar;
    menuIcon.onkeydown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleNavbar();
        }
    };

    navbar.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                toggleNavbar();
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navbar.classList.contains('active')) {
            toggleNavbar();
            menuIcon.focus();
        }
    });
}

// Interactive Game UI Mockup Controls
const playerHealthFill = document.querySelector('.player-health-fill');
const enemyHealthFill = document.querySelector('.enemy-health-fill');
const playerHealthBar = document.querySelector('.player-status-card .health-bar-container');
const enemyHealthBar = document.querySelector('.enemy-status-card .health-bar-container');
const enemyHpCells = document.querySelectorAll('.enemy-stat-cells .stat-cell');
const playerCharBox = document.querySelector('.player-char-box');
const enemyCharBox = document.querySelector('.enemy-char-box');
const combatButtons = document.querySelectorAll('.combat-btn');
const chargeButton = document.querySelector('.combat-btn[data-action="charge"]');
const choiceButtons = document.querySelectorAll('.choice-btn');
const dialogueText = document.querySelector('#dialogue-text');

let playerHealth = 100;
let enemyHealth = 100;
let isCharged = false;

const updateHealthUI = () => {
    if (playerHealthFill) {
        playerHealthFill.style.width = `${playerHealth}%`;
        if (playerHealthBar) {
            playerHealthBar.setAttribute('aria-valuenow', playerHealth);
            playerHealthBar.setAttribute('aria-label', `Player 1 Health: ${playerHealth}%`);
        }
    }

    if (enemyHealthFill) {
        enemyHealthFill.style.width = `${enemyHealth}%`;
        if (enemyHealthBar) {
            enemyHealthBar.setAttribute('aria-valuenow', enemyHealth);
            enemyHealthBar.setAttribute('aria-label', `Enemy 1 Health: ${enemyHealth}%`);
        }
    }

    // Update enemy HP stat cells (4 segments)
    if (enemyHpCells && enemyHpCells.length >= 4) {
        const activeCount = enemyHealth > 75 ? 4 : enemyHealth > 50 ? 3 : enemyHealth > 25 ? 2 : enemyHealth > 0 ? 1 : 0;
        enemyHpCells.forEach((cell, index) => {
            if (index < activeCount) {
                cell.classList.add('active');
            } else {
                cell.classList.remove('active');
            }
        });
    }
};

combatButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;

        if (action === 'punch' || action === 'kick') {
            const isKick = action === 'kick';
            const baseDamage = isKick ? 15 : 10;
            const damage = isCharged ? baseDamage * 2 : baseDamage;
            const actionName = isKick ? 'Kick' : 'Punch';

            enemyHealth = Math.max(0, enemyHealth - damage);
            updateHealthUI();

            // Hit animation on enemy
            if (enemyCharBox) {
                enemyCharBox.classList.remove('hit');
                void enemyCharBox.offsetWidth; // Force reflow to re-trigger CSS keyframe
                enemyCharBox.classList.add('hit');
            }

            // Dialogue feedback
            if (dialogueText) {
                if (enemyHealth === 0) {
                    dialogueText.textContent = `CRITICAL BLOW! Enemy 1 was defeated by ${actionName}!`;
                } else if (isCharged) {
                    dialogueText.textContent = `SUPERCHARGED ${actionName.toUpperCase()}! Dealt ${damage} damage to Enemy 1!`;
                } else {
                    dialogueText.textContent = `Player 1 used ${actionName}! Enemy 1 took ${damage} damage.`;
                }
            }

            // Reset charge state
            if (isCharged) {
                isCharged = false;
                if (chargeButton) chargeButton.classList.remove('active');
                if (playerCharBox) playerCharBox.classList.remove('charged');
            }
        } else if (action === 'heal') {
            if (playerHealth >= 100) {
                if (dialogueText) {
                    dialogueText.textContent = 'Player 1 is already at full health (100%)!';
                }
            } else {
                const healAmount = 15;
                playerHealth = Math.min(100, playerHealth + healAmount);
                updateHealthUI();

                if (playerCharBox) {
                    playerCharBox.classList.remove('healing');
                    void playerCharBox.offsetWidth;
                    playerCharBox.classList.add('healing');
                }

                if (dialogueText) {
                    dialogueText.textContent = `Player 1 used Heal! Restored ${healAmount} HP (now ${playerHealth}%).`;
                }
            }
        } else if (action === 'charge') {
            isCharged = true;
            if (chargeButton) chargeButton.classList.add('active');
            if (playerCharBox) playerCharBox.classList.add('charged');

            if (dialogueText) {
                dialogueText.textContent = 'Charge activated! Player 1 is glowing with energy. Next attack deals 2x damage!';
            }
        }
    });
});

choiceButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const choice = btn.dataset.choice;

        choiceButtons.forEach((b) => {
            const isTarget = b === btn;
            b.classList.toggle('active', isTarget);
            b.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
        });

        if (dialogueText) {
            if (choice === 'hi') {
                dialogueText.textContent = 'Hello, this is a dialogue example… The quick brown fox jumps over the lazy dog.';
            } else if (choice === 'bye') {
                dialogueText.textContent = 'Farewell, brave traveler! Return whenever you are ready for the next challenge.';
            }
        }
    });
});

// Initialize display
updateHealthUI();
