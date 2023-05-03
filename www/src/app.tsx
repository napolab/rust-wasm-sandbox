import { useCallback, useEffect, useRef, useState } from "react";

import { lifeGame } from "./lifegame";

export const App = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const game = useRef<ReturnType<typeof lifeGame> | null>(null);
  const [cells, setCells] = useState<number[]>([]);
  const handleClick = useCallback(() => {
    const current = game.current?.next()?.value;
    if (!Array.isArray(current)) return;

    setCells(current);
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const instance = lifeGame({ canvas: ref.current, cell: 5 });
    game.current = instance;
    instance.next();
  }, []);

  return (
    <div>
      <canvas ref={ref} />
      <button onClick={handleClick}>next</button>
    </div>
  );
};
