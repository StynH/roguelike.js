export class ColorManipulator {
    private static hexToRgb(hex: string): [number, number, number] {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
        } else {
            throw new Error("Invalid HEX color");
        }
    }

    private static rgbToHex(r: number, g: number, b: number): string {
        const componentToHex = (c: number): string => {
            const hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };

        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    private static adjustColorValue(colorValue: number, adjustment: number): number {
        const newValue = colorValue + adjustment;
        return Math.min(255, Math.max(0, newValue));
    }

    public static adjustColor(hex: string, adjustment: number): string {
        const [r, g, b] = this.hexToRgb(hex);
        const newR = this.adjustColorValue(r, adjustment);
        const newG = this.adjustColorValue(g, adjustment);
        const newB = this.adjustColorValue(b, adjustment);
        return this.rgbToHex(newR, newG, newB);
    }
}
