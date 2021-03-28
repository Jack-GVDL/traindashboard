// Data
// ...


// Local Function
// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
function convertHSVtoRGB(h: any, s: any, v: any) {
    let r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;1
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ]
}


// Global Function
export function getPalette(h: any = null, s: any = null, v: any = null) {
    // generate random rgb
    // HSV
    // h: hue
    // s: saturation
    // v: value (brightness?)
    if (h == null) h = Math.random();
    if (s == null) s = Math.random();
    if (v == null) v = Math.random();

    const color = convertHSVtoRGB(h, s, v);
    const rgba = {
        r: color[0],
        g: color[1],
        b: color[2],
        a: 1.0
    };

    return rgba;
}
