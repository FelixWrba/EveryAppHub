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
    return weight * (to - from) + from;
}
