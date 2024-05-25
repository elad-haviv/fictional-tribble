export interface PseudoRandomNumberGeneratorInterface {
    seed: number;
    next(): number;
}

export class MersenneTwister implements PseudoRandomNumberGeneratorInterface {
    public readonly seed: number;

    private static readonly N = 624;
    private static readonly M = 397;
    private static readonly MATRIX_A = 0x9908b0df;
    private static readonly UPPER_MASK = 0x80000000;
    private static readonly LOWER_MASK = 0x7fffffff;
    private static readonly TEMPERING_MASK_B = 0x9d2c5680;
    private static readonly TEMPERING_MASK_C = 0xefc60000;

    private mt: number[] = new Array<number>(MersenneTwister.N);
    private mti: number = MersenneTwister.N + 1;

    constructor(seed: number) {
        this.seed = seed;
        this.mt[0] = seed >>> 0;
        for (this.mti = 1; this.mti < MersenneTwister.N; this.mti++) {
            const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] =
                ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
                (s & 0x0000ffff) * 1812433253 +
                this.mti;
            this.mt[this.mti] = this.mt[this.mti] >>> 0;
        }
    }

    next(): number {
        let y: number;
        if (this.mti >= MersenneTwister.N) {
            let kk: number;
            for (kk = 0; kk < MersenneTwister.N - MersenneTwister.M; kk++) {
                y =
                    (this.mt[kk] & MersenneTwister.UPPER_MASK) |
                    (this.mt[kk + 1] & MersenneTwister.LOWER_MASK);
                this.mt[kk] =
                    this.mt[kk + MersenneTwister.M] ^
                    (y >>> 1) ^
                    (y & 1 ? MersenneTwister.MATRIX_A : 0);
            }
            for (; kk < MersenneTwister.N - 1; kk++) {
                y =
                    (this.mt[kk] & MersenneTwister.UPPER_MASK) |
                    (this.mt[kk + 1] & MersenneTwister.LOWER_MASK);
                this.mt[kk] =
                    this.mt[kk + (MersenneTwister.M - MersenneTwister.N)] ^
                    (y >>> 1) ^
                    (y & 1 ? MersenneTwister.MATRIX_A : 0);
            }
            y =
                (this.mt[MersenneTwister.N - 1] & MersenneTwister.UPPER_MASK) |
                (this.mt[0] & MersenneTwister.LOWER_MASK);
            this.mt[MersenneTwister.N - 1] =
                this.mt[MersenneTwister.M - 1] ^
                (y >>> 1) ^
                (y & 1 ? MersenneTwister.MATRIX_A : 0);
            this.mti = 0;
        }

        y = this.mt[this.mti++];
        y ^= y >>> 11;
        y ^= (y << 7) & MersenneTwister.TEMPERING_MASK_B;
        y ^= (y << 15) & MersenneTwister.TEMPERING_MASK_C;
        y ^= y >>> 18;
        return y >>> 0;
    }
}

export default class Random implements PseudoRandomNumberGeneratorInterface {
    public readonly seed: number;
    private mt: MersenneTwister;

    constructor(seed: number) {
        this.seed = seed;
        this.mt = new MersenneTwister(seed);
    }

    next(): number {
        return this.mt.next();
    }

    nextFloat(): number {
        return this.next() / 0xffffffff;
    }

    nextRange(min: number, max: number): number {
        return min + Math.floor(this.nextFloat() * (max - min));
    }

    nextFloatRange(min: number, max: number): number {
        return min + this.nextFloat() * (max - min);
    }

    nextBoolean(): boolean {
        return this.next() % 2 === 0;
    }

    nextElement<T>(array: T[]): T {
        return array[this.nextRange(0, array.length)];
    }

    nextShuffle<T>(array: T[]): T[] {
        const shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = this.nextRange(0, i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    nextString(length: number): string {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += this.nextElement(Array.from(charset));
        }
        return result;
    }

    nextColor(): string {
        return `#${this.next().toString(16).padStart(6, "0")}`;
    }

    nextColorRGB(): [number, number, number] {
        const color = this.next();
        return [
            (color & 0xff0000) >> 16,
            (color & 0x00ff00) >> 8,
            color & 0x0000ff,
        ];
    }
}