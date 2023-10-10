export class MathHelper {
    public static euclideanDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    public static manhattanDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    public static chebyshevDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
    }
}
