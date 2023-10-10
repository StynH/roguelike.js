export class Window{
    private readonly StandardColor = "#EEE";

    private div: HTMLElement;
    private cells: HTMLElement[][];
    private readonly rows: number;
    private readonly cols: number;

    constructor(rows: number, cols: number) {
        this.div = document.querySelector('.game-container') as HTMLElement;
        this.cells = [];
        this.rows = rows;
        this.cols = cols;

        this.setupGrid();
    }

    public clear(): void{
        for(let r = 0; r < this.rows; ++r){
            for(let c = 0; c < this.cols; ++c){
                this.cells[r][c].innerHTML = "";
            }
        }
    }

    private setupGrid(): void {
        this.div.style.gridTemplateRows = `repeat(${this.rows}, 16px)`;
        this.div.style.gridTemplateColumns = `repeat(${this.cols}, 16px)`;

        for (let row = 0; row < this.rows; row++) {
            const rowCells: HTMLElement[] = [];
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                this.div.appendChild(cell);
                rowCells.push(cell);
            }

            this.cells.push(rowCells);
        }
    }

    public drawAt(row: number, col: number, content: string): void {
        this.drawAtColored(row, col, content, this.StandardColor);
    }

    public drawAtColored(row: number, col: number, content: string, color: string): void {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.cells[row][col].textContent = content;
            this.cells[row][col].style.color = color;
        }
    }
}
