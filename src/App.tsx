import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

/* ===================== TIPOS COMUNS ===================== */

type Toast = { id: number; message: string };

interface GameProps {
  onAchievement?: (msg: string) => void;
}

/* ===================== CLICK FURY ===================== */

const ClickFury: React.FC<GameProps> = ({ onAchievement }) => {
  const [count, setCount] = useState(0);
  const [best, setBest] = useState(0);
  const [message, setMessage] = useState(
    "Clique no botão. Sim, é literalmente isso."
  );

  useEffect(() => {
    if (count === 0) return;

    if (count > best) {
      setBest(count);
      if (count === 10) onAchievement?.("10 cliques. Seu mouse mandou abraço.");
      if (count === 50) onAchievement?.("50 cliques. A economia brasileira sente o impacto.");
      if (count === 100) onAchievement?.("100 cliques. Isso já conta como cardio.");
    }

    if (count < 10) setMessage("Tá com medo de clicar? Ele não morde.");
    else if (count < 30) setMessage("Ok, agora você está levando isso a sério.");
    else if (count < 80) setMessage("Você oficialmente não tem mais o que fazer hoje.");
    else setMessage("Tá tudo bem em casa?");
  }, [count, best, onAchievement]);

  const reset = () => {
    setCount(0);
    setMessage("Reiniciou… achou que ia mudar algo na sua vida?");
  };

  return (
    <div className="game-card">
      <h2>⚡ Click Fury</h2>
      <p className="game-description">
        Clique no botão o máximo que conseguir. Inútil? Sim. Divertido? Talvez.
      </p>

      <div className="stats-row">
        <div className="stat">
          <span>Cliques atuais</span>
          <strong>{count}</strong>
        </div>
        <div className="stat">
          <span>Recorde pessoal</span>
          <strong>{best}</strong>
        </div>
      </div>

      <button
        className="primary-btn huge"
        onClick={() => setCount((c) => c + 1)}
      >
        CLICA AQUI
      </button>

      <button className="secondary-btn" onClick={reset}>
        resetar a vergonha
      </button>

      <p className="snarky-text">{message}</p>
    </div>
  );
};

/* ===================== ROCK PAPER SARCASM ===================== */

type Move = "pedra" | "papel" | "tesoura";

const moves: Move[] = ["pedra", "papel", "tesoura"];
const winMap: Record<Move, Move> = {
  pedra: "tesoura",
  papel: "pedra",
  tesoura: "papel",
};

const RockPaperSarcasm: React.FC<GameProps> = ({ onAchievement }) => {
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [botMove, setBotMove] = useState<Move | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });

  const sarcasm = useMemo(() => {
    if (!result) return "Faça sua jogada e aceite as consequências.";
    if (result === "Empate") return "Empate. Nem o computador se esforçou.";
    if (result === "Vitória") {
      if (score.win >= 5) {
        onAchievement?.(
          "Você está ganhando demais. O bot pediu férias."
        );
      }
      return "Você ganhou. O robô está reconsiderando a carreira.";
    }
    if (score.lose >= 5) {
      onAchievement?.("Perdeu várias vezes. Persistência é uma qualidade. Dizem.");
    }
    return "Derrota. Mas olha, pelo menos foi rápido.";
  }, [result, score.win, score.lose, onAchievement]);

  const play = (move: Move) => {
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    setPlayerMove(move);
    setBotMove(randomMove);

    if (move === randomMove) {
      setResult("Empate");
      setScore((s) => ({ ...s, draw: s.draw + 1 }));
    } else if (winMap[move] === randomMove) {
      setResult("Vitória");
      setScore((s) => ({ ...s, win: s.win + 1 }));
    } else {
      setResult("Derrota");
      setScore((s) => ({ ...s, lose: s.lose + 1 }));
    }
  };

  return (
    <div className="game-card">
      <h2>✊ Rock Paper Sarcasm</h2>
      <p className="game-description">
        Pedra, papel, tesoura e humilhação digital opcional.
      </p>

      <div className="stats-row">
        <div className="stat small">
          <span>Vitórias</span>
          <strong>{score.win}</strong>
        </div>
        <div className="stat small">
          <span>Empates</span>
          <strong>{score.draw}</strong>
        </div>
        <div className="stat small">
          <span>Derrotas</span>
          <strong>{score.lose}</strong>
        </div>
      </div>

      <div className="btn-row">
        <button className="primary-btn ghost" onClick={() => play("pedra")}>
          🪨 Pedra
        </button>
        <button className="primary-btn ghost" onClick={() => play("papel")}>
          📄 Papel
        </button>
        <button className="primary-btn ghost" onClick={() => play("tesoura")}>
          ✂️ Tesoura
        </button>
      </div>

      <div className="result-panel">
        <p>
          Você: <strong>{playerMove ?? "—"}</strong>
        </p>
        <p>
          Bot: <strong>{botMove ?? "—"}</strong>
        </p>
        <p className="result-text">{result ?? "Esperando sua genialidade."}</p>
        <p className="snarky-text">{sarcasm}</p>
      </div>
    </div>
  );
};

/* ===================== MEMORY MESS ===================== */

type Card = {
  id: number;
  value: string;
  revealed: boolean;
  matched: boolean;
};

const baseValues = ["🧠", "💻", "☕"];

const makeDeck = (): Card[] => {
  const values = [...baseValues, ...baseValues];
  return values
    .map((v) => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((o, i) => ({
      id: i,
      value: o.v,
      revealed: false,
      matched: false,
    }));
};

const MemoryMess: React.FC<GameProps> = ({ onAchievement }) => {
  const [deck, setDeck] = useState<Card[]>(() => makeDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (deck.every((c) => c.matched) && !completed) {
      setCompleted(true);
      if (moves <= 6) {
        onAchievement?.("Terminou o Memory Mess em poucos movimentos. Respeito.");
      } else {
        onAchievement?.("Terminou o Memory Mess! Nem foi tão humilhante assim.");
      }
    }
  }, [deck, completed, moves, onAchievement]);

  const handleClick = (card: Card) => {
    if (card.revealed || card.matched || selected.length === 2) return;

    const newDeck = deck.map((c) =>
      c.id === card.id ? { ...c, revealed: true } : c
    );
    const newSelected = [...selected, card.id];

    setDeck(newDeck);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [aId, bId] = newSelected;
      const a = newDeck.find((c) => c.id === aId)!;
      const b = newDeck.find((c) => c.id === bId)!;

      if (a.value === b.value) {
        setTimeout(() => {
          setDeck((prev) =>
            prev.map((c) =>
              c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
            )
          );
          setSelected([]);
        }, 400);
      } else {
        setTimeout(() => {
          setDeck((prev) =>
            prev.map((c) =>
              c.id === a.id || c.id === b.id ? { ...c, revealed: false } : c
            )
          );
          setSelected([]);
        }, 600);
      }
    }
  };

  const reset = () => {
    setDeck(makeDeck());
    setSelected([]);
    setMoves(0);
    setCompleted(false);
  };

  return (
    <div className="game-card">
      <h2>🧩 Memory Mess</h2>
      <p className="game-description">
        Jogo da memória pra provar que você lembra de algo além de senha de Wi-Fi.
      </p>

      <div className="stats-row">
        <div className="stat small">
          <span>Movimentos</span>
          <strong>{moves}</strong>
        </div>
        <div className="stat small">
          <span>Status</span>
          <strong>{completed ? "Concluído" : "Em progresso"}</strong>
        </div>
      </div>

      <div className="memory-grid">
        {deck.map((card) => (
          <button
            key={card.id}
            className={`memory-card ${
              card.revealed || card.matched ? "revealed" : ""
            } ${card.matched ? "matched" : ""}`}
            onClick={() => handleClick(card)}
          >
            {card.revealed || card.matched ? card.value : "?"}
          </button>
        ))}
      </div>

      <button className="secondary-btn" onClick={reset}>
        resetar fracassos anteriores
      </button>

      {completed && (
        <p className="snarky-text">
          Acabou! Agora pode voltar a fingir que está ocupado.
        </p>
      )}
    </div>
  );
};

/* ===================== REACTION ROULETTE ===================== */

type ReactionState = "idle" | "waiting" | "click-now" | "too-soon" | "done";

const ReactionRoulette: React.FC<GameProps> = ({ onAchievement }) => {
  const [state, setState] = useState<ReactionState>("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const start = () => {
    setState("waiting");
    setReactionTime(null);
    const delay = 1000 + Math.random() * 4000;
    timeoutRef.current = window.setTimeout(() => {
      setState("click-now");
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handleClick = () => {
    if (state === "idle") {
      start();
      return;
    }
    if (state === "waiting") {
      setState("too-soon");
      return;
    }
    if (state === "click-now" && startTimeRef.current) {
      const now = performance.now();
      const rt = Math.round(now - startTimeRef.current);
      setReactionTime(rt);
      setState("done");

      if (rt < 200) onAchievement?.("Reflexo absurdo. Tá jogando ou é trigger finger?");
      else if (rt > 600) onAchievement?.("Seus reflexos pedem café. Muito café.");

      return;
    }
    if (state === "too-soon" || state === "done") {
      setState("idle");
      setReactionTime(null);
    }
  };

  const label = (() => {
    switch (state) {
      case "idle":
        return "Clique para começar o teste.";
      case "waiting":
        return "Espere ficar verde. Segura a ansiedade.";
      case "click-now":
        return "AGORA! CLICA!";
      case "too-soon":
        return "Calma, velocista. Foi cedo demais.";
      case "done":
        return reactionTime !== null
          ? `Seu tempo: ${reactionTime} ms. Parabéns (ou não).`
          : "Algo bugou. O que combina com a vida.";
    }
  })();

  return (
    <div className="game-card">
      <h2>🚨 Reaction Roulette</h2>
      <p className="game-description">
        Clique assim que a caixa ficar verde. Parece fácil… até tentar.
      </p>

      <div
        className={`reaction-box ${
          state === "click-now" ? "go" : ""
        }`}
        onClick={handleClick}
      >
        <p>{label}</p>
        {state === "done" && reactionTime !== null && (
          <p className="reaction-score">{reactionTime} ms</p>
        )}
        {(state === "idle" || state === "done" || state === "too-soon") && (
          <p className="hint">Clique para {state === "idle" ? "começar" : "tentar de novo"}.</p>
        )}
      </div>
    </div>
  );
};

/* ===================== FLAPPY LIZ ===================== */

type Pipe = { x: number; gapY: number; passed: boolean };

const FLAPPY_WIDTH = 320;
const FLAPPY_HEIGHT = 220;
const BIRD_X = 60;
const GAP = 70;
const PIPE_WIDTH = 40;
const GRAVITY = 0.25;
const JUMP_VELOCITY = -4;
const PIPE_SPEED = 2;

const FlappyLiz: React.FC<GameProps> = ({ onAchievement }) => {
  const [birdY, setBirdY] = useState(FLAPPY_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(
    "Clique ou aperte espaço para começar. É só isso mesmo."
  );
  const loopRef = useRef<number | null>(null);

  const createPipe = (): Pipe => {
    const margin = 40;
    const gapY =
      margin + Math.random() * (FLAPPY_HEIGHT - margin * 2 - GAP);
    return { x: FLAPPY_WIDTH + 40, gapY, passed: false };
  };

  const start = () => {
    setBirdY(FLAPPY_HEIGHT / 2);
    setVelocity(0);
    setPipes([createPipe(), { ...createPipe(), x: FLAPPY_WIDTH + 160 }]);
    setScore(0);
    setRunning(true);
    setMessage("Voa, Liz, voa. Ou tenta.");
  };

  const flap = () => {
    if (!running) {
      start();
      return;
    }
    setVelocity(JUMP_VELOCITY);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  useEffect(() => {
    if (!running) {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      return;
    }

    const tick = () => {
      setVelocity((v) => v + GRAVITY);

      setPipes((prev) => {
        let updated = prev.map((p) => ({ ...p, x: p.x - PIPE_SPEED }));

        if (updated.length && updated[0].x + PIPE_WIDTH < 0) {
          updated = [...updated.slice(1), createPipe()];
        }

        updated = updated.map((p) => {
          if (!p.passed && p.x + PIPE_WIDTH < BIRD_X) {
            p.passed = true;
            setScore((s) => {
              const ns = s + 1;
              if (ns === 5) {
                onAchievement?.("5 pontos no Flappy Liz. Coordenação ok.");
              } else if (ns === 10) {
                onAchievement?.("10 pontos! Você claramente desistiu da vida produtiva.");
              }
              return ns;
            });
          }
          return p;
        });

        return updated;
      });

      setBirdY((currentY) => {
        let y = currentY + velocity;

        if (y < 0 || y > FLAPPY_HEIGHT) {
          setRunning(false);
          setMessage("Você caiu. Pelo menos não foi no boleto.");
          onAchievement?.("Liz encontrou o chão. A gravidade sempre vence.");
          return FLAPPY_HEIGHT / 2;
        }

        let hit = false;
        pipes.forEach((p) => {
          const inX =
            BIRD_X + 18 > p.x && BIRD_X - 18 < p.x + PIPE_WIDTH;
          const topBottomCollision =
            y - 12 < p.gapY || y + 12 > p.gapY + GAP;

          if (inX && topBottomCollision) hit = true;
        });

        if (hit) {
          setRunning(false);
          setMessage("Você bateu no tubo. Metáfora perfeita pra vida adulta.");
          onAchievement?.("Colisão honrosa no Flappy Liz.");
          return FLAPPY_HEIGHT / 2;
        }

        return y;
      });

      loopRef.current = requestAnimationFrame(tick);
    };

    loopRef.current = requestAnimationFrame(tick);
    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [running, velocity, pipes, onAchievement]);

  return (
    <div className="game-card">
      <h2>🐤 Flappy Liz Bird</h2>
      <p className="game-description">
        Desvie dos tubos, acumule pontos e ignore que tem coisas importantes pra fazer.
      </p>

      <div className="stats-row">
        <div className="stat small">
          <span>Score</span>
          <strong>{score}</strong>
        </div>
        <div className="stat small">
          <span>Status</span>
          <strong>{running ? "Em voo" : "Parado"}</strong>
        </div>
      </div>

      <div className="flappy-container" onClick={flap}>
        <div className="flappy-sky">
          <div className="flappy-bird" style={{ top: birdY }}>
            🐥
          </div>
          {pipes.map((p, i) => (
            <div key={i} className="flappy-pipe-pair">
              <div
                className="flappy-pipe flappy-pipe-top"
                style={{ left: p.x, height: p.gapY }}
              />
              <div
                className="flappy-pipe flappy-pipe-bottom"
                style={{
                  left: p.x,
                  top: p.gapY + GAP,
                  height: FLAPPY_HEIGHT - (p.gapY + GAP),
                }}
              />
            </div>
          ))}
        </div>
        <p className="hint">Clique ou aperte espaço para pular.</p>
      </div>

      <p className="snarky-text">{message}</p>
    </div>
  );
};

/* ===================== TETRIS DO CAOS (SIMPLES) ===================== */

type Cell = 0 | 1 | 2 | 3 | 4;
type Point = [number, number];

const COLS = 10;
const ROWS = 18;

type Shape = { blocks: Point[]; type: Cell };

const SHAPES: Shape[] = [
  { blocks: [[0, 0], [1, 0], [0, 1], [1, 1]], type: 1 }, // quadrado
  { blocks: [[0, 0], [1, 0], [2, 0], [3, 0]], type: 2 }, // linha
  { blocks: [[0, 0], [0, 1], [0, 2], [1, 2]], type: 3 }, // L
  { blocks: [[1, 0], [0, 1], [1, 1], [2, 1]], type: 4 }, // T
];

type Piece = { shapeIndex: number; rotation: number; x: number; y: number };

const rotatePoint = ([x, y]: Point, rotation: number): Point => {
  let px = x;
  let py = y;
  for (let i = 0; i < rotation; i++) {
    [px, py] = [py, -px];
  }
  return [px, py];
};

const getBlocks = (piece: Piece): Point[] => {
  const shape = SHAPES[piece.shapeIndex];
  const rotated = shape.blocks.map((b) =>
    rotatePoint(b as Point, piece.rotation % 4)
  );
  const minX = Math.min(...rotated.map((b) => b[0]));
  const minY = Math.min(...rotated.map((b) => b[1]));
  const normalized = rotated.map(([x, y]) => [x - minX, y - minY]) as Point[];
  return normalized.map(([x, y]) => [x + piece.x, y + piece.y]) as Point[];
};

const emptyGrid = (): Cell[][] =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => 0 as Cell)
  );

const randomPiece = (): Piece => ({
  shapeIndex: Math.floor(Math.random() * SHAPES.length),
  rotation: 0,
  x: 3,
  y: 0,
});

const canMove = (grid: Cell[][], piece: Piece): boolean => {
  const cells = getBlocks(piece);
  for (const [x, y] of cells) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
    if (grid[y][x] !== 0) return false;
  }
  return true;
};

const mergePiece = (grid: Cell[][], piece: Piece): Cell[][] => {
  const newGrid = grid.map((row) => [...row]);
  const shape = SHAPES[piece.shapeIndex];
  const cells = getBlocks(piece);
  cells.forEach(([x, y]) => {
    if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
      newGrid[y][x] = shape.type;
    }
  });
  return newGrid;
};

const clearLines = (grid: Cell[][]): { grid: Cell[][]; lines: number } => {
  const remaining: Cell[][] = [];
  let cleared = 0;
  for (let y = 0; y < ROWS; y++) {
    if (grid[y].every((c) => c !== 0)) {
      cleared++;
    } else {
      remaining.push(grid[y]);
    }
  }
  while (remaining.length < ROWS) {
    remaining.unshift(Array.from({ length: COLS }, () => 0 as Cell));
  }
  return { grid: remaining, lines: cleared };
};

const TetrisChaos: React.FC<GameProps> = ({ onAchievement }) => {
  const [grid, setGrid] = useState<Cell[][]>(() => emptyGrid());
  const [piece, setPiece] = useState<Piece>(() => randomPiece());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      setPiece((prev) => {
        const moved: Piece = { ...prev, y: prev.y + 1 };
        if (canMove(grid, moved)) return moved;

        const merged = mergePiece(grid, prev);
        const { grid: clearedGrid, lines: cleared } = clearLines(merged);
        setGrid(clearedGrid);

        if (cleared > 0) {
          setLines((l) => l + cleared);
          setScore((s) => s + cleared * 100);
          if (cleared >= 2) {
            onAchievement?.("Limpou mais de uma linha! Sua terapeuta vai adorar essa organização.");
          }
        }

        const nextPiece = randomPiece();
        if (!canMove(clearedGrid, nextPiece)) {
          setGameOver(true);
          onAchievement?.("Game over no Tetris do Caos. Afogado em blocos, como na vida.");
          return prev;
        }

        return nextPiece;
      });
    }, 700);

    return () => clearInterval(id);
  }, [grid, gameOver, onAchievement]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === "ArrowLeft") {
        setPiece((prev) => {
          const moved = { ...prev, x: prev.x - 1 };
          return canMove(grid, moved) ? moved : prev;
        });
      } else if (e.key === "ArrowRight") {
        setPiece((prev) => {
          const moved = { ...prev, x: prev.x + 1 };
          return canMove(grid, moved) ? moved : prev;
        });
      } else if (e.key === "ArrowDown") {
        setPiece((prev) => {
          const moved = { ...prev, y: prev.y + 1 };
          return canMove(grid, moved) ? moved : prev;
        });
      } else if (e.key === "ArrowUp") {
        setPiece((prev) => {
          const rotated = { ...prev, rotation: prev.rotation + 1 };
          return canMove(grid, rotated) ? rotated : prev;
        });
      } else if (e.key === " ") {
        setPiece((prev) => {
          let dropped = { ...prev };
          while (canMove(grid, { ...dropped, y: dropped.y + 1 })) {
            dropped = { ...dropped, y: dropped.y + 1 };
          }
          return dropped;
        });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [grid, gameOver]);

  const reset = () => {
    setGrid(emptyGrid());
    setPiece(randomPiece());
    setScore(0);
    setLines(0);
    setGameOver(false);
  };

  const currentCells = getBlocks(piece);
  const displayGrid: Cell[][] = grid.map((row) => [...row]);
  const shape = SHAPES[piece.shapeIndex];

  currentCells.forEach(([x, y]) => {
    if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
      displayGrid[y][x] = shape.type;
    }
  });

  return (
    <div className="game-card">
      <h2>🧱 Tetris do Caos</h2>
      <p className="game-description">
        Organize blocos caindo do céu. Diferente da vida, aqui dá pra apertar “reset”.
      </p>

      <div className="stats-row">
        <div className="stat small">
          <span>Score</span>
          <strong>{score}</strong>
        </div>
        <div className="stat small">
          <span>Linhas</span>
          <strong>{lines}</strong>
        </div>
        <div className="stat small">
          <span>Status</span>
          <strong>{gameOver ? "Game Over" : "Em jogo"}</strong>
        </div>
      </div>

      <div className="tetris-wrapper">
        <div className="tetris-grid">
          {displayGrid.map((row, y) => (
            <div key={y} className="tetris-row">
              {row.map((cell, x) => (
                <div
                  key={x}
                  className={`tetris-cell ${cell !== 0 ? "filled" : ""} ${
                    cell ? `t${cell}` : ""
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="tetris-help">
          <p>Controles:</p>
          <ul>
            <li>⬅️ ➡️ mover</li>
            <li>⬇️ descer</li>
            <li>⬆️ girar</li>
            <li>Espaço: cair direto no caos</li>
          </ul>
          <button className="secondary-btn" onClick={reset}>
            recomeçar o caos
          </button>
        </div>
      </div>

      {gameOver && (
        <p className="snarky-text">
          Acabou o jogo, mas não as suas pendências na vida real.
        </p>
      )}
    </div>
  );
};

/* ===================== APP PRINCIPAL ===================== */

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function App() {
  const [activeGame, setActiveGame] = useState<
    "click" | "rps" | "memory" | "reaction" | "flappy" | "tetris"
  >("click");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [chaosMode, setChaosMode] = useState(false);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === KONAMI[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        if (nextIndex === KONAMI.length) {
          addToast("Konami code ativado. Infelizmente, sua vida continua a mesma.");
          setKonamiIndex(0);
          setChaosMode(true);
        } else {
          setKonamiIndex(nextIndex);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konamiIndex]);

  const renderGame = () => {
    switch (activeGame) {
      case "click":
        return <ClickFury onAchievement={addToast} />;
      case "rps":
        return <RockPaperSarcasm onAchievement={addToast} />;
      case "memory":
        return <MemoryMess onAchievement={addToast} />;
      case "reaction":
        return <ReactionRoulette onAchievement={addToast} />;
      case "flappy":
        return <FlappyLiz onAchievement={addToast} />;
      case "tetris":
        return <TetrisChaos onAchievement={addToast} />;
    }
  };

  return (
    <div className={`app-root ${chaosMode ? "chaos" : ""}`}>
      <header className="app-header">
        <div>
          <h1>Liz Arcade 🎮</h1>
          <p className="subtitle">
            Um lugar para desperdiçar tempo com estilo, sarcasmo e um pouco de React.
          </p>
        </div>
        <div className="header-right">
          <small className="version-pill">v0.0.nem-lancei</small>
          <button
            className="ghost-link"
            onClick={() => {
              setChaosMode((prev) => !prev);
              addToast(
                chaosMode
                  ? "Modo caótico desativado. Bem-vindo de volta ao tédio."
                  : "Modo caótico ativado. Não diga que eu não avisei."
              );
            }}
          >
            não clique aqui
          </button>
        </div>
      </header>

      <main className="app-main">
        <aside className="game-menu">
          <h2>Jogos</h2>
          <p className="menu-subtitle">
            Escolha uma desculpa para não fazer nada produtivo.
          </p>
          <nav className="game-list">
            <button
              className={`game-item ${activeGame === "click" ? "active" : ""}`}
              onClick={() => setActiveGame("click")}
            >
              ⚡ Click Fury
              <span>clique até a dignidade acabar</span>
            </button>
            <button
              className={`game-item ${activeGame === "rps" ? "active" : ""}`}
              onClick={() => setActiveGame("rps")}
            >
              ✊ Rock Paper Sarcasm
              <span>pedra, papel, tesoura e humilhação digital</span>
            </button>
            <button
              className={`game-item ${activeGame === "memory" ? "active" : ""}`}
              onClick={() => setActiveGame("memory")}
            >
              🧠 Memory Mess
              <span>prove que o TikTok não levou tudo embora</span>
            </button>
            <button
              className={`game-item ${activeGame === "reaction" ? "active" : ""}`}
              onClick={() => setActiveGame("reaction")}
            >
              🚨 Reaction Roulette
              <span>clique no tempo certo (em teoria)</span>
            </button>
            <button
              className={`game-item ${activeGame === "flappy" ? "active" : ""}`}
              onClick={() => setActiveGame("flappy")}
            >
              🐤 Flappy Liz Bird
              <span>desvie de tubos e das suas responsabilidades</span>
            </button>
            <button
              className={`game-item ${activeGame === "tetris" ? "active" : ""}`}
              onClick={() => setActiveGame("tetris")}
            >
              🧱 Tetris do Caos
              <span>organize blocos, já que a vida não dá</span>
            </button>
          </nav>

          <section className="panel">
            <h3>Instruções (meio inúteis)</h3>
            <ul>
              <li>Use o teclado, o mouse e zero responsabilidade.</li>
              <li>Alguns textos mudam dependendo de quão bem (ou mal) você joga.</li>
              <li>Existe um código secreto de videogame clássico escondido aqui… 👀</li>
            </ul>
          </section>

          <section className="panel tiny-print">
            <p>
              * Qualquer semelhança com produtividade é mera coincidência.
              <br />
              * Nenhuma KPI foi ferida na criação deste site.
            </p>
          </section>
        </aside>

        <section className="game-area">{renderGame()}</section>
      </main>

      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
