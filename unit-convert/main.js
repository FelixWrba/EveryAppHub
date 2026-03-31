/*
Unit types (SI-Unit): Length(m), Area(m²), Volume(m³), Mass(kg), Temperature(celsius), Time(s), Velocity(m/s)

Unit: { name: string, types: UnitType[] }
UnitType: { name: string, factor: float, short: string }
*/
const units = [
    {
        name: 'Länge',
        siUnit: 'Meter',
        types: [
            { name: 'Lichtjahr', factor: 9454254955488000.0, short: 'ly', },
            { name: 'Astronomische Einheit', factor: 149597870700.0, short: 'ae', },
            { name: 'Nautische Meile', factor: 1853.184, short: 'nm', },
            { name: 'Meile', factor: 1609.344, short: 'mi', },
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
    },
    {
        name: 'Fläche',
        siUnit: 'Quadratmeter',
        types: [
            { name: 'Quadratmeile', factor: 2589988.110, short: 'mi2' },
            { name: 'Quadratkilometer', factor: 1000000, short: 'km2' },
            { name: 'Hektar', factor: 10000, short: 'ha' },
            { name: 'Ar', factor: 100, short: 'a' },
            { name: 'Quadratmeter', factor: 1, short: 'm2' },
            { name: 'Quadratfuß', factor: 0.09290304, short: 'ft2' },
            { name: 'Quadratdezimeter', factor: 0.01, short: 'dm2' },
            { name: 'Quadratzoll', factor: 0.00064516, short: 'in2' },
            { name: 'Quadratzentimeter', factor: 0.0001, short: 'cm2' },
            { name: 'Quadratmillimeter', factor: 0.000001, short: 'mm2' },
        ]
    },
    {
        name: 'Volumen',
        siUnit: 'Kubikmeter',
        types: [
            { name: 'Kubikmeile', factor: 4168181825.441, short: 'mi3' },
            { name: 'Kubikkilometer', factor: 1000000000, short: 'km3' },
            { name: 'Kubikmeter', factor: 1, short: 'm3' },
            { name: 'Barrel', factor: 0.158987294, short: 'bl' },
            { name: 'Kubikfuß', factor: 0.028316847, short: 'ft3' },
            { name: 'Kubikdezimeter', factor: 0.001, short: 'dm3' },
            { name: 'Liter', factor: 0.001, short: 'l' },
            { name: 'Gallone', factor: 0.003785411, short: 'gal' },
            { name: 'Pint', factor: 0.000473176473, short: 'pt' },
            { name: 'Kubikzoll', factor: 0.000016387, short: 'in3' },
            { name: 'Kubikzentimeter', factor: 0.000001, short: 'cm3' },
            { name: 'Milliliter', factor: 0.000001, short: 'ml' },
        ]
    },
    {
        name: 'Geschwindigkeit',
        siUnit: 'Meter/Sekunde',
        types: [
            { name: 'Lichtgeschwindigkeit', factor: 299792458, short: 'ls' },
            { name: 'Meter/Sekunde', factor: 1, short: 'mps' },
            { name: 'Knoten', factor: 0.514444444, short: 'kn' },
            { name: 'Meilen/Stunde', factor: 0.4469, short: 'mph' },
            { name: 'Kilometer/Stunde', factor: 0.277777778, short: 'kmh' },
            { name: 'Fuß/Minute', factor: 0.00508, short: 'fpm' },
        ]
    },
    {
        name: 'Gewicht',
        siUnit: 'Kilogramm',
        types: [
            { name: 'Tonne', factor: 1000, short: 't' },
            { name: 'Kilogramm', factor: 1, short: 'kg' },
            { name: 'Pfund', factor: 0.454, short: 'lb' },
            { name: 'Gramm', factor: 0.001, short: 'g' },
            { name: 'Milligramm', factor: 0.000001, short: 'mg' },
        ]
    },
    {
        name: 'Zeit',
        siUnit: 'Sekunde',
        types: [
            { name: 'Jahr', factor: 31557600, short: 'y' },
            { name: 'Monat', factor: 2629800, short: 'mon' },
            { name: 'Woche', factor: 604800, short: 'w' },
            { name: 'Tag', factor: 86400, short: 'd' },
            { name: 'Stunde', factor: 3600, short: 'h' },
            { name: 'Minute', factor: 60, short: 'min' },
            { name: 'Sekunde', factor: 1, short: 'sec' },
            { name: 'Millisekunde', factor: 0.001, short: 'mils' },
            { name: 'Mikrosekunde', factor: 0.000001, short: 'mics' },
            { name: 'Nanosekunde', factor: 0.000000001, short: 'nans' },
        ]
    },
    {
        name: 'Temperatur',
        siUnit: '°Kelvin',
        types: [
            { name: '°Celsius', factor: -1, short: 'c', to: n => n - 273.15, from: n => n + 273.15 },
            { name: '°Kelvin', factor: 1, short: 'k' },
            { name: '°Fahrenheit', factor: -1, short: 'f', to: n => 1.8 * n - 459.67, from: n => (n + 459.67) * 0.555555556 },
        ]
    },
    {
        name: 'Speicherplatz',
        siUnit: 'Byte',
        types: [
            { name: 'Byte', factor: 1, short: 'b' },
            { name: 'Kilobyte', factor: 1000, short: 'kb' },
            { name: 'Megabyte', factor: 1000000, short: 'mb' },
            { name: 'Gigabyte', factor: 1000000000, short: 'gb' },
            { name: 'Terabyte', factor: 1000000000000, short: 'tb' },
            { name: 'Bit', factor: 0.125, short: 'bit' },
            { name: 'Kilobit', factor: 125, short: 'kbit' },
            { name: 'Megabit', factor: 125000, short: 'mbit' },
            { name: 'Gigabit', factor: 125000000, short: 'gbit' },
            { name: 'Terabit', factor: 125000000000, short: 'tbit' },
            { name: 'Kibibyte', factor: 1024, short: 'kib' },
            { name: 'Mebibyte', factor: 1048576, short: 'meb' },
            { name: 'Gibibyte', factor: 1073741824, short: 'gib' },
            { name: 'Tebibyte', factor: 1099511627776, short: 'teb' },
        ]
    }
]

const defaultUseComma = Intl.NumberFormat()
    .formatToParts(1.1)
    .find(part => part.type === 'decimal')
    .value === ',';

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

function getUnitHelpList() {
    let helpHTML = units.map(unit => `<h2>${unit.name}</h2><ul>${unit.types.map(type => `<li>[ ${type.short} ] = 1 ${type.name} = ${type.factor === -1 ? type.to(1) : type.factor} ${unit.siUnit}</li>`).join('')
        }</ul>`).join('');

    if(defaultUseComma) {
        helpHTML = helpHTML.replace(/\./g, ',');
    }

    return helpHTML;
}

function getUnitOverview() {
    return `<form onsubmit="handleUnitConvert(); return false" class="unit-form">
    <input type="text" placeholder="Beispiel: 104F (Fahrenheit)" id="unit-field" autocomplete="off" spellcheck="false" />
    <button type="submit">Umrechnen</button></form>
    <p id="error">&#9432; Ergebnisse sind auf 6 Nachkommastellen gerundet.</p>
    <section id="results"></section>
    <section>${getUnitHelpList()}</section>`;
}

function handleUnitConvert() {
    $('#results').innerHTML = '';
    const { value, shortcut, useComma, error } = parseInput($('#unit-field').value);

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

    const { conversions, conversionError } = getUnitConversions(unit, type, value, useComma);

    if (conversionError) {
        $('#error').innerHTML = error;
        return;
    }

    $('#results').innerHTML = conversions;
    setTimeout(() => $('#results').scrollIntoView({ behavior: 'smooth' }), 50);
}

function getUnitConversions(unit, type, value, useComma) {
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
    const siUnit = factor === -1 ? units[unit].types[type].from(value) : (value * factor);

    conversions = `<h2>${value} ${units[unit].types[type].name} = </h2><ul>`;
    conversions += units[unit].types
        .map(type => {
            const result = type.factor === -1 ? type.to(siUnit) : (siUnit / type.factor);
            return `<li><span class="convert-number">${roundNumber(result)}</span> ${type.name}</li>`
        })
        .join('');
    conversions += '</ul>'

    if (useComma) {
        conversions = conversions.replace(/\./g, ',');
    }

    return { conversions, conversionError };
}

function parseInput(input) {
    let value, shortcut, error;
    let useComma = defaultUseComma;
    // check which decimal seperator in input
    for(let i = 0; i < input.length; i++) {
        if(input[i] === ',') {
            useComma = true;
            break;
        }
        else if(input[i] === '.') {
            useComma = false;
            break;
        }
    }

    input = input.trim().toLowerCase().replace(',', '.');
    if (input === '' || !!input.replace(/[0-9]+\.?[0-9]*[A-z]+[0-9]*/, '')) {
        error = 'Ungültige Eingabe. Eingabe ist wie folgt zu formatieren: [Zahl][Abkürzung der Einheit]';
    }
    else {
        const firstLetterIndex = findFirstLetter(input);
        value = Number(input.slice(0, firstLetterIndex));
        shortcut = input.slice(firstLetterIndex);
        if (isNaN(value) || !isFinite(value)) {
            error = `Ungülltige Zahl: Zahl muss im Bereich von 0 - ${Number.MAX_VALUE} liegen.`;
        }
    }

    return { value, shortcut, useComma, error };
}

function roundNumber(number) {
    // handle edge cases
    if (!isFinite(number)) {
        return '< ' + Number.MAX_VALUE;
    }
    let asString = number.toString();
    if (asString.includes('e') || !asString.includes('.')) {
        return asString;
    }
    return number.toFixed(6);

    const precision = 3;
    let validFigures = 0;
    let expectTrailingNull = true;
    let isDecimalPart = false;

    console.log(asString);

    for (let i = 0; i < asString.length; i++) {
        if (asString[i] === '.') {
            isDecimalPart = true;
            continue;
        }
        if (asString[i] === '0') {
            if (!expectTrailingNull) {
                validFigures++;
            }
        }
        else {
            validFigures++;
            expectTrailingNull = false;
        }

        if (validFigures >= precision) {
            asString = asString.slice(0, i + 1);
            break;
        }
    }

    return asString;
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