/**
 * Equivalent to the document.querySelector() method
 * @param {string} selector
 * @returns {HTMLElement | null}
 */
function $(selector) {
    return document.querySelector(selector);
}

function x(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

function serialize(number) {
    return Math.max(Math.abs(number), 1);
}

function lerp(from, to, weight) {
    return from + weight * (to - from);
}

function hide(element) {
    element.style.visibility = 'hidden';
}

function show(element) {
    element.style.visibility = 'visible';
}
