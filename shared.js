/* shared.js — Gemensamma funktioner for alla disciplinsidor
 *
 * Varje disciplinfil maste definiera dessa globala variabler INNAN shared.js laddas:
 *   const DISCIPLINE_NAME = 'Precision';
 *   const STORAGE_KEY = 'precision_autosave';
 *   const weaponAbbreviations = [...];
 *   let preloadedMembers = [];
 *   let customLogoDataUrl = null;
 *
 * Valfria hooks (definiera i disciplinfilen):
 *   function getExtraAutoSaveData() { return { ... }; }
 *   function restoreExtraAutoSaveData(data) { ... }
 *   function resetExtraFields() { ... }
 */

// === Utility functions ===

function capitalizeName(str) {
    if (!str) return str;
    return str.replace(/(^|\s)[a-zA-ZåäöÅÄÖ]/g, function(match) {
        return match.toUpperCase();
    });
}

function capitalizeFirstLetter(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeCSVField(value) {
    const str = String(value);
    if (str.includes(';') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

// === Member/name system ===

function preloadMembers() {
    try {
        const saved = localStorage.getItem('membersList');
        if (saved) {
            const lines = JSON.parse(saved);
            preloadedMembers = lines.map(name => capitalizeName(name));
        }
    } catch(e) { console.warn('preloadMembers failed:', e); }
}

function setupNameInputWithSuggestions(nameInput, isLeaderField = false) {
    const container = nameInput.parentElement;
    let dropdown = container.querySelector('.suggestions-dropdown');

    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'suggestions-dropdown';
        container.appendChild(dropdown);
    }

    let currentHighlightIndex = -1;
    let isAutoCompleting = false;
    let wasAutoCompleted = false;
    let originalAutoCompletedValue = '';

    nameInput.addEventListener('input', function() {
        if (isAutoCompleting) {
            isAutoCompleting = false;
            return;
        }

        if (wasAutoCompleted && this.value !== originalAutoCompletedValue) {
            wasAutoCompleted = false; originalAutoCompletedValue = '';
        }

        const query = this.value.toLowerCase().trim();
        currentHighlightIndex = -1;

        if (query.length === 0 || preloadedMembers.length === 0) {
            hideDropdown();
            return;
        }

        const exactMatches = preloadedMembers.filter(name =>
            name.toLowerCase().startsWith(query)
        );
        const partialMatches = preloadedMembers.filter(name =>
            name.toLowerCase().includes(query) && !name.toLowerCase().startsWith(query)
        );

        const allMatches = [...exactMatches, ...partialMatches];

        if (allMatches.length === 0) {
            hideDropdown();
            return;
        }

        if (allMatches.length === 1 && exactMatches.length === 1) {
            isAutoCompleting = true;
            wasAutoCompleted = true;
            originalAutoCompletedValue = allMatches[0];

            const currentValue = allMatches[0];
            setTimeout(() => {
                this.value = currentValue;
                hideDropdown();

                if (isLeaderField) {
                    const freeTextArea = document.getElementById('freeText');
                    if (freeTextArea) freeTextArea.focus();
                } else {
                    const row = this.closest('tr');
                    const groupSelect = row ? row.querySelector('.group') : null;
                    if (groupSelect) groupSelect.focus();
                }
            }, 100);
            return;
        }

        showSuggestions(allMatches.slice(0, 6));
    });

    nameInput.addEventListener('keydown', function(e) {
        const suggestionItems = dropdown.querySelectorAll('.suggestion-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentHighlightIndex = Math.min(currentHighlightIndex + 1, suggestionItems.length - 1);
            updateHighlight();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentHighlightIndex = Math.max(currentHighlightIndex - 1, -1);
            updateHighlight();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentHighlightIndex >= 0 && suggestionItems[currentHighlightIndex]) {
                selectSuggestion(suggestionItems[currentHighlightIndex].textContent);
            }
        } else if (e.key === 'Escape') {
            hideDropdown();
        } else if (e.key === 'Tab') {
            hideDropdown();
        }
    });

    nameInput.addEventListener('blur', function() {
        setTimeout(() => hideDropdown(), 150);
    });

    nameInput.addEventListener('focus', function() {
        this.select();
        if (this.value === '') {
            isAutoCompleting = false;
            wasAutoCompleted = false;
            originalAutoCompletedValue = '';
        }
    });

    function showSuggestions(matches) {
        dropdown.innerHTML = '';

        matches.forEach(name => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = name;
            item.addEventListener('click', () => selectSuggestion(name));
            dropdown.appendChild(item);
        });

        dropdown.style.display = 'block';

        setTimeout(() => {
            const inputRect = nameInput.getBoundingClientRect();
            const dropdownHeight = dropdown.offsetHeight;
            dropdown.style.left = inputRect.left + 'px';
            dropdown.style.width = inputRect.width + 'px';
            dropdown.style.top = (inputRect.top - dropdownHeight - 5) + 'px';
        }, 0);
    }

    function hideDropdown() {
        dropdown.style.display = 'none';
        currentHighlightIndex = -1;
    }

    function updateHighlight() {
        const suggestionItems = dropdown.querySelectorAll('.suggestion-item');
        suggestionItems.forEach((item, index) => {
            item.classList.toggle('highlighted', index === currentHighlightIndex);
        });
    }

    function selectSuggestion(name) {
        isAutoCompleting = true;
        wasAutoCompleted = true;
        originalAutoCompletedValue = name;
        nameInput.value = name;
        hideDropdown();
        nameInput.dispatchEvent(new Event('change'));

        setTimeout(() => {
            if (isLeaderField) {
                const freeTextArea = document.getElementById('freeText');
                if (freeTextArea) freeTextArea.focus();
            } else {
                const row = nameInput.closest('tr');
                const groupSelect = row ? row.querySelector('.group') : null;
                if (groupSelect) groupSelect.focus();
            }
        }, 50);
    }
}

function setupWeaponInputWithSuggestions(weaponInput) {
    const container = weaponInput.parentElement;
    let dropdown = container.querySelector('.suggestions-dropdown');

    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'suggestions-dropdown';
        container.appendChild(dropdown);
    }

    let currentHighlightIndex = -1;
    let isAutoCompleting = false;
    let wasAutoCompleted = false;
    let originalAutoCompletedValue = '';

    weaponInput.addEventListener('input', function() {
        if (isAutoCompleting) {
            isAutoCompleting = false;
            return;
        }

        if (wasAutoCompleted && this.value !== originalAutoCompletedValue) {
            wasAutoCompleted = false; originalAutoCompletedValue = '';
        }

        const query = this.value.trim();
        currentHighlightIndex = -1;

        if (query.length === 0) {
            hideDropdown();
            return;
        }

        const exactMatches = weaponAbbreviations.filter(weapon =>
            weapon.toLowerCase().startsWith(query.toLowerCase())
        );
        const partialMatches = weaponAbbreviations.filter(weapon =>
            weapon.toLowerCase().includes(query.toLowerCase()) && !weapon.toLowerCase().startsWith(query.toLowerCase())
        );

        const sortedExactMatches = exactMatches.sort((a, b) => {
            if (a.toLowerCase() === query.toLowerCase()) return -1;
            if (b.toLowerCase() === query.toLowerCase()) return 1;
            return a.length - b.length;
        });

        const allMatches = [...sortedExactMatches, ...partialMatches];

        if (allMatches.length === 0) {
            hideDropdown();
            return;
        }

        if (allMatches.length === 1 && exactMatches.length === 1 && exactMatches[0].toLowerCase() === query.toLowerCase()) {
            isAutoCompleting = true;
            wasAutoCompleted = true;
            originalAutoCompletedValue = allMatches[0];
            this.value = allMatches[0];
            hideDropdown();

            setTimeout(() => {
                const row = this.closest('tr');
                const firstScore = row.querySelector('.score') || row.querySelector('.station') || row.querySelector('.stn-t');
                if (firstScore) firstScore.focus();
            }, 50);
            return;
        }

        showSuggestions(allMatches.slice(0, 6));
    });

    weaponInput.addEventListener('keydown', function(e) {
        const suggestionItems = dropdown.querySelectorAll('.suggestion-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentHighlightIndex = Math.min(currentHighlightIndex + 1, suggestionItems.length - 1);
            updateHighlight();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentHighlightIndex = Math.max(currentHighlightIndex - 1, -1);
            updateHighlight();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentHighlightIndex >= 0 && suggestionItems[currentHighlightIndex]) {
                selectSuggestion(suggestionItems[currentHighlightIndex].textContent);
            }
        } else if (e.key === 'Escape') {
            hideDropdown();
        } else if (e.key === 'Tab') {
            const query = this.value.trim();
            if (query.length > 0 && suggestionItems.length > 0) {
                e.preventDefault();
                selectSuggestion(suggestionItems[0].textContent);
            }
            hideDropdown();
        }
    });

    weaponInput.addEventListener('blur', function() {
        setTimeout(() => hideDropdown(), 150);
    });

    weaponInput.addEventListener('focus', function() {
        if (this.value === '') {
            isAutoCompleting = false;
            wasAutoCompleted = false;
            originalAutoCompletedValue = '';
        }
    });

    function showSuggestions(matches) {
        dropdown.innerHTML = '';

        matches.forEach(weapon => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = weapon;
            item.addEventListener('click', () => selectSuggestion(weapon));
            dropdown.appendChild(item);
        });

        dropdown.style.display = 'block';

        setTimeout(() => {
            const inputRect = weaponInput.getBoundingClientRect();
            const dropdownHeight = dropdown.offsetHeight;
            dropdown.style.left = inputRect.left + 'px';
            dropdown.style.width = inputRect.width + 'px';
            dropdown.style.top = (inputRect.top - dropdownHeight - 5) + 'px';
        }, 0);
    }

    function hideDropdown() {
        dropdown.style.display = 'none';
        currentHighlightIndex = -1;
    }

    function updateHighlight() {
        const suggestionItems = dropdown.querySelectorAll('.suggestion-item');
        suggestionItems.forEach((item, index) => {
            item.classList.toggle('highlighted', index === currentHighlightIndex);
        });
    }

    function selectSuggestion(weapon) {
        isAutoCompleting = true;
        wasAutoCompleted = true;
        originalAutoCompletedValue = weapon;
        weaponInput.value = weapon;
        hideDropdown();
        weaponInput.dispatchEvent(new Event('change'));

        setTimeout(() => {
            const row = weaponInput.closest('tr');
            const firstScore = row.querySelector('.score') || row.querySelector('.station') || row.querySelector('.stn-t');
            if (firstScore) firstScore.focus();
        }, 50);
    }
}

// === Warning toast ===

let warningTimeout;
function showWarning(msg) {
    const el = document.getElementById('validationWarning');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(warningTimeout);
    warningTimeout = setTimeout(() => el.classList.remove('show'), 2500);
}

// === Text editor ===

function formatText(command) {
    const textarea = document.getElementById('freeText');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedText = '';
    switch(command) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'underline':
            formattedText = `_${selectedText}_`;
            break;
    }

    if (selectedText) {
        textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
        textarea.focus();
        textarea.setSelectionRange(start, start + formattedText.length);
    }
}

function insertText(text) {
    const textarea = document.getElementById('freeText');
    const start = textarea.selectionStart;
    textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(start);
    textarea.focus();
    textarea.setSelectionRange(start + text.length, start + text.length);
}

function clearText() {
    document.getElementById('freeText').value = '';
    document.getElementById('freeText').focus();
}

// === Modal ===

function closeModal() {
    document.getElementById('submitModal').style.display = 'none';
    document.querySelector('.modal-backdrop').style.display = 'none';
}

// === Member list auto-update ===

function updateMembersList() {
    try {
        const tbody = document.getElementById('resultsBody');
        if (!tbody) return;
        const names = [];
        tbody.querySelectorAll('.name').forEach(input => {
            const name = input.value.trim();
            if (name) names.push(name);
        });
        if (names.length === 0) return;

        const saved = localStorage.getItem('membersList');
        const existing = saved ? JSON.parse(saved) : [];
        const existingLower = existing.map(n => n.toLowerCase());
        let added = 0;
        names.forEach(name => {
            if (!existingLower.includes(name.toLowerCase())) {
                existing.push(name);
                existingLower.push(name.toLowerCase());
                added++;
            }
        });
        if (added > 0) {
            localStorage.setItem('membersList', JSON.stringify(existing));
            preloadMembers();
        }
    } catch(e) { console.warn('updateMembersList failed:', e); }
}

// === Submit results ===

function submitResults() {
    if (typeof validateRowData === 'function' && !validateRowData()) {
        return;
    }

    updateMembersList();
    calculateAndSort();
    if (typeof saveToFile === 'function') saveToFile();
    else if (typeof saveCSV === 'function') saveCSV();

    setTimeout(() => {
        skapaPDF();
    }, 100);

    const competitionTitle = document.getElementById('competitionTitle').value;
    const date = document.getElementById('date').value;
    document.getElementById('submitModal').style.display = 'block';
    document.querySelector('.modal-backdrop').style.display = 'block';

    const resultEmail = localStorage.getItem('resultEmail');
    if (resultEmail) {
        const emailSubject = encodeURIComponent(`Resultat ${competitionTitle} ${date}`);
        const emailBody = encodeURIComponent('Hej!\n\nBifogat finns resultaten från dagens tävling i både CSV- och PDF-format.\n\nMvh');
        setTimeout(() => { window.location.href = `mailto:${resultEmail}?subject=${emailSubject}&body=${emailBody}`; }, 500);
    }
}

// === PDF helpers ===

function addPageNumbers(doc) {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Sida ${i} av ${pageCount}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
    }
    doc.setTextColor(0, 0, 0);
}

// === Autosave ===

let hasUnsavedChanges = false;

function autoSave() {
    try {
        const data = {
            title: document.getElementById('competitionTitle').value,
            date: document.getElementById('date').value,
            leader: document.getElementById('leader').value,
            freeText: document.getElementById('freeText').value,
            rows: []
        };

        // Discipline-specific extra data
        if (typeof getExtraAutoSaveData === 'function') {
            Object.assign(data, getExtraAutoSaveData());
        }

        const tbody = document.getElementById('resultsBody');
        Array.from(tbody.rows).forEach(row => {
            const rd = { _inputs: [] };
            row.querySelectorAll('input, select').forEach(el => { rd._inputs.push({ cls: el.className, val: el.value }); });
            data.rows.push(rd);
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        hasUnsavedChanges = false;
        const s = document.getElementById('saveStatus');
        if (s) { s.classList.add('show'); setTimeout(() => s.classList.remove('show'), 1500); }
    } catch(e) { console.warn('autoSave failed:', e); }
}

function autoRestore() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return false;
        const data = JSON.parse(saved);
        if (!data.rows || data.rows.length === 0) return false;

        document.getElementById('competitionTitle').value = data.title || '';
        document.getElementById('date').value = data.date || '';
        document.getElementById('leader').value = data.leader || '';
        document.getElementById('freeText').value = data.freeText || '';

        // Discipline-specific extra data
        if (typeof restoreExtraAutoSaveData === 'function') {
            restoreExtraAutoSaveData(data);
        }

        const tbody = document.getElementById('resultsBody'); tbody.innerHTML = '';
        data.rows.forEach(rd => {
            addRow();
            const row = tbody.lastElementChild;
            const inputs = row.querySelectorAll('input, select');
            if (rd._inputs) rd._inputs.forEach((s, i) => { if (inputs[i]) inputs[i].value = s.val; });
        });

        // Update totals using whichever function the discipline defines
        Array.from(tbody.rows).forEach(row => {
            if (typeof updateSpringTotals === 'function') updateSpringTotals(row);
            if (typeof updateTotals === 'function') updateTotals(row);
            if (typeof updateTotal === 'function') updateTotal(row);
        });

        return true;
    } catch(e) { console.warn('autoRestore failed:', e); return false; }
}

function rensaAllt() {
    if (!confirm('Vill du rensa alla resultat? Detta går inte att ångra.')) return;
    localStorage.removeItem(STORAGE_KEY);
    const tbody = document.getElementById('resultsBody'); tbody.innerHTML = '';
    document.getElementById('competitionTitle').value = DISCIPLINE_NAME;
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('leader').value = '';
    document.getElementById('freeText').value = '';

    // Discipline-specific reset
    if (typeof resetExtraFields === 'function') {
        resetExtraFields();
    }

    addRow(); addRow();
}

// === Initialization (runs when shared.js loads) ===

// Unsaved changes warning
window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Autosave on input/change with 500ms debounce
document.addEventListener('input', () => { hasUnsavedChanges = true; clearTimeout(window._st); window._st = setTimeout(autoSave, 500); });
document.addEventListener('change', () => { hasUnsavedChanges = true; clearTimeout(window._st); window._st = setTimeout(autoSave, 500); });

// Load saved data and members
customLogoDataUrl = localStorage.getItem('customLogo') || null;
preloadMembers();

// Restore and setup leader field after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { autoRestore(); }, 100);
    const leaderInput = document.getElementById('leader');
    if (leaderInput) setupNameInputWithSuggestions(leaderInput, true);
});
