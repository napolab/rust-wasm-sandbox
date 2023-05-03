import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg.wasm";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const drawGrid = (ctx: CanvasRenderingContext2D, cell: number, width: number, height: number) => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // 縦線
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (cell + 1) + 1, 0);
    ctx.lineTo(i * (cell + 1) + 1, (cell + 1) * height + 1);
  }

  // 横線
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((cell + 1) * width + 1, j * (cell + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row: number, column: number, width: number) => {
  return row * width + column;
};

const drawCells = (ctx: CanvasRenderingContext2D, cell: number, universe: Universe, width: number, height: number): number[] => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col, width);

      ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        cell,
        cell
      );
    }
  }

  ctx.stroke();

  return Array.from(cells);
};

type LifeGameInput = {
  canvas: HTMLCanvasElement;
  cell: number;
};
export function* lifeGame({ canvas, cell }: LifeGameInput) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("ctx is null");

  const input = Array(64 * 60).fill(0).map(() => Math.random() > 0.9 ? Cell.Alive : Cell.Dead)
  const universe = Universe.new(new Uint32Array(input));
  const width = universe.width();
  const height = universe.height();
  canvas.height = (cell + 1) * height + 1;
  canvas.width = (cell + 1) * width + 1;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    drawGrid(ctx, cell, width, height);
    yield drawCells(ctx, cell, universe, width, height);

    universe.tick();
  }
}
