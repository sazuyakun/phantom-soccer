import { GOALS_TO_WIN } from "../shared/constants"
import { GameState } from "../shared/types"
import { SPAWN_DISTANCE } from "./characters"

export function resetPositions(game: GameState) {
  game.ball.position = { x: 0, y: 0, z: 0 }
  game.ball.velocity = { x: 0, y: 0, z: 0 }
  for (const character of game.characters) {
    character.position = { x: 0, y: 0, z: character.side * SPAWN_DISTANCE }
    character.angle = character.side === 1 ? Math.PI : 0
    character.speed = 0
    character.velocityY = 0
  }
}

export function scoreGoal(game: GameState, ringSide: 1 | -1) {
  if (ringSide === 1) game.scores.far++
  else game.scores.near++
  resetPositions(game)

  const winnerSide =
    game.scores.near >= GOALS_TO_WIN
      ? 1
      : game.scores.far >= GOALS_TO_WIN
        ? -1
        : 0
  if (winnerSide !== 0) {
    Rune.gameOver({
      players: Object.fromEntries(
        game.characters.map((c) => [
          c.id,
          c.side === winnerSide ? "WON" : "LOST",
        ])
      ),
    })
  }
}
