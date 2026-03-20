/*
Unit types (SI-Unit): Length(m), Area(m²), Volume(m³), Mass(kg), Temperature(celsius), Time(s), Velocity(m/s)

Unit: { name: string, types: UnitType[] }
UnitType: { name: string, factor: float, short: string }
*/
const units = [
    {
        name: "Länge",
        types: [
            { name: 'Lichtjahr', factor: 9454254955488000.0, short: 'ly', },
            { name: 'Astronomische Einheit', factor: 149597870700.0, short: 'ae', },
            { name: 'Nautische Meile', factor: 1853.184, short: 'nm', },
            { name: 'Meile', factor: 1482, short: 'mi', },
            { name: 'Kilometer', factor: 1000, short: 'km', },
            { name: 'Hektometer', factor: 100, short: 'hm', },
            { name: 'Meter', factor: 1, short: 'm', },
            { name: 'Yard', factor: 0.9144, short: 'yd', },
            { name: 'Fuß', factor: 0.3048, short: 'ft', },
            { name: 'Dezimeter', factor: 0.1, short: 'dm', },
            { name: 'Zoll', factor: 0.0254, short: 'in', },
            { name: 'Zentimeter', factor: 0.01, short: 'cm', },
            { name: 'Millimeter', factor: 0.001, short: 'mm', },
            { name: 'Mikrometer', factor: 0.000001, short: 'um', },
            { name: 'Nanometer', factor: 0.000000001, short: 'nm', },
            { name: 'Planck-Länge', factor: 1.616199e-35, short: 'pl', },
        ],
    }
]
const shortcutLookup = getShortcutLookup();

function getShortcutLookup() {
    const lookups = {};
    for (const unit in units) {
        for (const type in units[unit].types) {
            lookups[units[unit].types[type].short] = { unit, type };
        }
    }
    return lookups;
}

console.log(shortcutLookup);

function getUnitOverview() {
    return '<form onsubmit="handleUnitConvert(); return false"><input type="text" placeholder="3km" id="unit-field" autocomplete="off" spellcheck="off" /><button type="submit">Umrechnen</button></form><p id="error"></p><ul id="results"></ul>';
}

function handleUnitConvert() {
    $('#results').innerHTML = '';
    const { value, shortcut, error } = parseInput($('#unit-field').value);

    if (error) {
        $('#error').innerHTML = error;
        return;
    }

    const { unit, type } = shortcutLookup[shortcut] || { unit: undefined, type: undefined };

    if (!unit) {
        $('#error').innerHTML = 'Ungültige Einheit';
        return;
    }
    $('#error').innerHTML = '';

    const { conversions, conversionError } = getUnitConversions(unit, type, value);

    if (conversionError) {
        $('#error').innerHTML = error;
        return;
    }

    $('#results').innerHTML = conversions;
}

function getUnitConversions(unit, type, value) {
    let conversions, conversionError;
    /*
    Example: 100cm => ?? km
    1. convert to SI-unit with factor: 100cm * 100 => 1m: 
    2. convert to other units: 1m / 0.001 => 1km
    */
    if (!unit || !type) {
        conversionError = 'Ungülige Einheit';
        return;
    }
    const factor = units[unit].types[type].factor;
    const siUnit = value * factor;

    conversions = `<h2>${value} ${units[unit].types[type].name} = </h2>`;
    conversions += units[unit].types
        .filter(type => type.factor !== factor)
        .map(type => `<li>${roundNumber(siUnit / type.factor)} ${type.name}</li>`).join('');

    return { conversions, conversionError };
}

function parseInput(input) {
    let value, shortcut, error;

    input = input.trim();
    if (input === '' || !!input.replace(/[0-9]+\.?[0-9]*[A-z]+/, '')) {
        error = 'Ungültige Eingabe. Eingabe ist wie folgt zu formatieren: [Zahl][Abkürzung der Einheit]';
    }
    else {
        const firstLetterIndex = findFirstLetter(input);
        value = Number(input.slice(0, firstLetterIndex));
        shortcut = input.slice(firstLetterIndex);
        if (isNaN(value) || !isFinite(value)) {
            error = `Unglültige Zahl: Zahl muss im Bereich von 0-${Number.MAX_VALUE} liegen.`;
        }
    }

    return { value, shortcut, error };
}

function roundNumber(number) {
    if(!isFinite(number)) {
        return '< ' + Number.MAX_VALUE;
    }
    if (number.toString().includes('e')) {
        return number;
    }
    const precision = 3;
    let rounded = number.toFixed(precision);
    let decimals = rounded.slice(-precision);
    let areDecimalsDiscarded = true;

    for (let i = precision - 1; i > -1; i--) {
        if (decimals[i] === '0') {
            rounded = rounded.slice(0, -1);
        }
        else {
            areDecimalsDiscarded = false;
            break;
        }
    }

    return areDecimalsDiscarded ? rounded.slice(0, -1) : rounded;
}

function findFirstLetter(text) {
    for (let i = 0; i < text.length; i++) {
        if (/[A-z]/.test(text[i])) {
            return i;
        }
    }
    return -1;
}

function renderPage(html) {
    $('#app').innerHTML = html;
}

(function init() {

    renderPage(getUnitOverview());

})();