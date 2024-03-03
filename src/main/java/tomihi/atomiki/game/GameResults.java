package tomihi.atomiki.game;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class GameResults {

    public enum WINNER {
        OWNER, COMPETITOR, DRAW
    }
    List<Coords> ownerAtoms;
    List<Coords> competitorAtoms;

    List<Coords> ownerGuessedCompetitorAtoms;
    List<Coords> competitorGuessedOwnerAtoms;

    Integer ownerScore;
    Integer competitorScore;

    WINNER winner;

    public static List<Coords> extractAtomsFromField(Field field) {
        final Space[][] table = field.getField();

        List<Coords> atoms = new ArrayList<>();

        for (int i = 0; i < table.length; i++) {
            for (int j = 0; j < table[i].length; j++) {
                if (table[i][j] != null && table[i][j].isAtom()) atoms.add(new Coords(i, j));
            }
        }
        return atoms;
    }

    private static Integer getScore(List<Coords> trueAtoms, List<Coords> guessedAtoms) {
        Integer result = 0;
        for (Coords guessedAtom : guessedAtoms) {
            for (Coords trueAtom : trueAtoms) {
                if (guessedAtom.equals(trueAtom)) result++;
            }
        }
        return result;
    }

    public GameResults(Game game) {
        this.ownerAtoms = extractAtomsFromField(game.getOwner().getField());
        this.competitorAtoms = extractAtomsFromField(game.getCompetitor().getField());
        this.ownerGuessedCompetitorAtoms = game.getOwner().getCompetitorMarks().getMarkedAtoms().stream().toList();
        this.competitorGuessedOwnerAtoms = game.getCompetitor().getCompetitorMarks().getMarkedAtoms().stream().toList();

        this.ownerScore = getScore(competitorAtoms, ownerGuessedCompetitorAtoms);
        this.competitorScore = getScore(ownerAtoms, competitorGuessedOwnerAtoms);

        if (this.ownerScore < this.competitorScore)
            this.winner = WINNER.COMPETITOR;
        else if (this.ownerScore > this.competitorScore)
            this.winner = WINNER.OWNER;
        else
            this.winner = WINNER.DRAW;
    }
}
