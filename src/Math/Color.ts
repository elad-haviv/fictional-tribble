export default class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r: number, g: number, b: number, a: number = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    get isOpaque(): boolean {
        return this.a === 1;
    }

    get isTransparent(): boolean {
        return this.a === 0;
    }

    get isGrayscale(): boolean {
        return this.r === this.g && this.g === this.b;
    }

    toHex(): string {
        return `#${this.r.toString(16).padStart(2, "0")}${this.g
            .toString(16)
            .padStart(2, "0")}${this.b.toString(16).padStart(2, "0")}`;
    }

    toHexa(): string {
        return `#${this.r.toString(16).padStart(2, "0")}${this.g
            .toString(16)
            .padStart(2, "0")}${this.b
            .toString(16)
            .padStart(2, "0")}${Math.round(this.a * 255)
            .toString(16)
            .padStart(2, "0")}`;
    }

    static fromHex(hex: string): Color {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return new Color(r, g, b);
    }

    static fromHexa(hex: string): Color {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        const a = parseInt(hex.substring(7, 9), 16) / 255;
        return new Color(r, g, b, a);
    }

    toString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    static fromString(color: string): Color {
        const match = color.match(
            /rgba?\((\d+), (\d+), (\d+)(, (\d+(\.\d+)?))?\)/
        );
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            const a = match[5] ? parseFloat(match[5]) : 1;
            return new Color(r, g, b, a);
        }
        throw new Error(`Invalid color string: ${color}`);
    }

    static lerp(a: Color, b: Color, t: number): Color {
        return new Color(
            a.r + (b.r - a.r) * t,
            a.g + (b.g - a.g) * t,
            a.b + (b.b - a.b) * t,
            a.a + (b.a - a.a) * t
        );
    }

    toGrayscale(): Color {
        const average = (this.r + this.g + this.b) / 3;
        return new Color(average, average, average, this.a);
    }

    getBrightness(): number {
        return (this.r + this.g + this.b) / 3;
    }

    getHue(): number {
        const min = Math.min(this.r, this.g, this.b);
        const max = Math.max(this.r, this.g, this.b);
        if (min === max) {
            return 0;
        }
        if (max === this.r) {
            return ((this.g - this.b) / (max - min)) % 6;
        }
        if (max === this.g) {
            return (this.b - this.r) / (max - min) + 2;
        }
        return (this.r - this.g) / (max - min) + 4;
    }

    getSaturation(): number {
        const min = Math.min(this.r, this.g, this.b);
        const max = Math.max(this.r, this.g, this.b);
        if (min === max) {
            return 0;
        }
        const l = (min + max) / 2;
        if (l <= 127.5) {
            return (max - min) / (max + min);
        }
        return (max - min) / (510 - max - min);
    }

    rotateHue(degrees: number): Color {
        const hsl = this.toHSL();
        hsl.h = (hsl.h + degrees) % 360;
        if (hsl.h < 0) {
            hsl.h += 360;
        }
        return Color.fromHSL(hsl);
    }

    toHSL(): { h: number; s: number; l: number } {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h *= 60;
        }
        return { h, s, l };
    }

    static fromHSL({ h, s, l }: { h: number; s: number; l: number }): Color {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        let r = 0;
        let g = 0;
        let b = 0;
        if (h < 60) {
            r = c;
            g = x;
        } else if (h < 120) {
            r = x;
            g = c;
        } else if (h < 180) {
            g = c;
            b = x;
        } else if (h < 240) {
            g = x;
            b = c;
        } else if (h < 300) {
            r = x;
            b = c;
        } else {
            r = c;
            b = x;
        }
        return new Color((r + m) * 255, (g + m) * 255, (b + m) * 255, 1);
    }

    complement(): Color {
        return this.rotateHue(180);
    }

    invert(): Color {
        return new Color(255 - this.r, 255 - this.g, 255 - this.b, this.a);
    }

    makePalette(count: number): Array<Color> {
        const colors : Array<Color> = [this];
        for (let i = 1; i < count; i++) {
            colors.push(this.rotateHue((360 / count) * i));
        }
        return colors;
    }

    lighten(amount: number): Color {
        return Color.lerp(this, new Color(255, 255, 255, this.a), amount);
    }

    darken(amount: number): Color {
        return Color.lerp(this, new Color(0, 0, 0, this.a), amount);
    }

    saturate(amount: number): Color {
        const hsl = this.toHSL();
        hsl.s = Math.min(1, hsl.s * amount);
        return Color.fromHSL(hsl);
    }

    desaturate(amount: number): Color {
        const hsl = this.toHSL();
        hsl.s = Math.max(0, hsl.s * amount);
        return Color.fromHSL(hsl);
    }

    fade(amount: number): Color {
        return new Color(this.r, this.g, this.b, this.a * amount);
    }

    blend(color: Color, amount: number): Color {
        return Color.lerp(this, color, amount);
    }

    equals(color: Color): boolean {
        return this.r === color.r && this.g === color.g && this.b === color.b && this.a === color.a;
    }
}

export const AliceBlue = new Color(240, 248, 255);
export const AntiqueWhite = new Color(250, 235, 215);
export const Aqua = new Color(0, 255, 255);
export const Aquamarine = new Color(127, 255, 212);
export const Azure = new Color(240, 255, 255);
export const Beige = new Color(245, 245, 220);
export const Bisque = new Color(255, 228, 196);
export const Black = new Color(0, 0, 0);
export const BlanchedAlmond = new Color(255, 235, 205);
export const Blue = new Color(0, 0, 255);
export const BlueViolet = new Color(138, 43, 226);
export const Brown = new Color(165, 42, 42);
export const BurlyWood = new Color(222, 184, 135);
export const CadetBlue = new Color(95, 158, 160);
export const Chartreuse = new Color(127, 255, 0);
export const Chocolate = new Color(210, 105, 30);
export const Coral = new Color(255, 127, 80);
export const CornflowerBlue = new Color(100, 149, 237);
export const Cornsilk = new Color(255, 248, 220);
export const Crimson = new Color(220, 20, 60);
export const Cyan = new Color(0, 255, 255);
export const DarkBlue = new Color(0, 0, 139);
export const DarkCyan = new Color(0, 139, 139);
export const DarkGoldenRod = new Color(184, 134, 11);
export const DarkGray = new Color(169, 169, 169);
export const DarkGrey = new Color(169, 169, 169);
export const DarkGreen = new Color(0, 100, 0);
export const DarkKhaki = new Color(189, 183, 107);
export const DarkMagenta = new Color(139, 0, 139);
export const DarkOliveGreen = new Color(85, 107, 47);
export const DarkOrange = new Color(255, 140, 0);
export const DarkOrchid = new Color(153, 50, 204);
export const DarkRed = new Color(139, 0, 0);
export const DarkSalmon = new Color(233, 150, 122);
export const DarkSeaGreen = new Color(143, 188, 143);
export const DarkSlateBlue = new Color(72, 61, 139);
export const DarkSlateGray = new Color(47, 79, 79);
export const DarkSlateGrey = new Color(47, 79, 79);
export const DarkTurquoise = new Color(0, 206, 209);
export const DarkViolet = new Color(148, 0, 211);
export const DeepPink = new Color(255, 20, 147);
export const DeepSkyBlue = new Color(0, 191, 255);
export const DimGray = new Color(105, 105, 105);
export const DimGrey = new Color(105, 105, 105);
export const DodgerBlue = new Color(30, 144, 255);
export const FireBrick = new Color(178, 34, 34);
export const FloralWhite = new Color(255, 250, 240);
export const ForestGreen = new Color(34, 139, 34);
export const Fuchsia = new Color(255, 0, 255);
export const Gainsboro = new Color(220, 220, 220);
export const GhostWhite = new Color(248, 248, 255);
export const Gold = new Color(255, 215, 0);
export const GoldenRod = new Color(218, 165, 32);
export const Gray = new Color(128, 128, 128);
export const Grey = new Color(128, 128, 128);
export const Green = new Color(0, 128, 0);
export const GreenYellow = new Color(173, 255, 47);
export const HoneyDew = new Color(240, 255, 240);
export const HotPink = new Color(255, 105, 180);
export const IndianRed = new Color(205, 92, 92);
export const Indigo = new Color(75, 0, 130);
export const Ivory = new Color(255, 255, 240);
export const Khaki = new Color(240, 230, 140);
export const Lavender = new Color(230, 230, 250);
export const LavenderBlush = new Color(255, 240, 245);
export const LawnGreen = new Color(124, 252, 0);
export const LemonChiffon = new Color(255, 250, 205);
export const LightBlue = new Color(173, 216, 230);
export const LightCoral = new Color(240, 128, 128);
export const LightCyan = new Color(224, 255, 255);
export const LightGoldenRodYellow = new Color(250, 250, 210);
export const LightGray = new Color(211, 211, 211);
export const LightGrey = new Color(211, 211, 211);
export const LightGreen = new Color(144, 238, 144);
export const LightPink = new Color(255, 182, 193);
export const LightSalmon = new Color(255, 160, 122);
export const LightSeaGreen = new Color(32, 178, 170);
export const LightSkyBlue = new Color(135, 206, 250);
export const LightSlateGray = new Color(119, 136, 153);
export const LightSlateGrey = new Color(119, 136, 153);
export const LightSteelBlue = new Color(176, 196, 222);
export const LightYellow = new Color(255, 255, 224);
export const Lime = new Color(0, 255, 0);
export const LimeGreen = new Color(50, 205, 50);
export const Linen = new Color(250, 240, 230);
export const Magenta = new Color(255, 0, 255);
export const Maroon = new Color(128, 0, 0);
export const MediumAquaMarine = new Color(102, 205, 170);
export const MediumBlue = new Color(0, 0, 205);
export const MediumOrchid = new Color(186, 85, 211);
export const MediumPurple = new Color(147, 112, 219);
export const MediumSeaGreen = new Color(60, 179, 113);
export const MediumSlateBlue = new Color(123, 104, 238);
export const MediumSpringGreen = new Color(0, 250, 154);
export const MediumTurquoise = new Color(72, 209, 204);
export const MediumVioletRed = new Color(199, 21, 133);
export const MidnightBlue = new Color(25, 25, 112);
export const MintCream = new Color(245, 255, 250);
export const MistyRose = new Color(255, 228, 225);
export const Moccasin = new Color(255, 228, 181);
export const NavajoWhite = new Color(255, 222, 173);
export const Navy = new Color(0, 0, 128);
export const OldLace = new Color(253, 245, 230);
export const Olive = new Color(128, 128, 0);
export const OliveDrab = new Color(107, 142, 35);
export const Orange = new Color(255, 165, 0);
export const OrangeRed = new Color(255, 69, 0);
export const Orchid = new Color(218, 112, 214);
export const PaleGoldenRod = new Color(238, 232, 170);
export const PaleGreen = new Color(152, 251, 152);
export const PaleTurquoise = new Color(175, 238, 238);
export const PaleVioletRed = new Color(219, 112, 147);
export const PapayaWhip = new Color(255, 239, 213);
export const PeachPuff = new Color(255, 218, 185);
export const Peru = new Color(205, 133, 63);
export const Pink = new Color(255, 192, 203);
export const Plum = new Color(221, 160, 221);
export const PowderBlue = new Color(176, 224, 230);
export const Purple = new Color(128, 0, 128);
export const RebeccaPurple = new Color(102, 51, 153);
export const Red = new Color(255, 0, 0);
export const RosyBrown = new Color(188, 143, 143);
export const RoyalBlue = new Color(65, 105, 225);
export const SaddleBrown = new Color(139, 69, 19);
export const Salmon = new Color(250, 128, 114);
export const SandyBrown = new Color(244, 164, 96);
export const SeaGreen = new Color(46, 139, 87);
export const SeaShell = new Color(255, 245, 238);
export const Sienna = new Color(160, 82, 45);
export const Silver = new Color(192, 192, 192);
export const SkyBlue = new Color(135, 206, 235);
export const SlateBlue = new Color(106, 90, 205);
export const SlateGray = new Color(112, 128, 144);
export const SlateGrey = new Color(112, 128, 144);
export const Snow = new Color(255, 250, 250);
export const SpringGreen = new Color(0, 255, 127);
export const SteelBlue = new Color(70, 130, 180);
export const Tan = new Color(210, 180, 140);
export const Teal = new Color(0, 128, 128);
export const Thistle = new Color(216, 191, 216);
export const Tomato = new Color(255, 99, 71);
export const Turquoise = new Color(64, 224, 208);
export const Violet = new Color(238, 130, 238);
export const Wheat = new Color(245, 222, 179);
export const White = new Color(255, 255, 255);
export const WhiteSmoke = new Color(245, 245, 245);
export const Yellow = new Color(255, 255, 0);
export const YellowGreen = new Color(154, 205, 50);


