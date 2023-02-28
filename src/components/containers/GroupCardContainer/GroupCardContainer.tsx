import GridLayout from "components/layouts/GridLayout/GridLayout";
import type { FC } from "react";
import type { TeamType } from "types/team.types";
import classNames from "utils/classNames";
import sortTeamsByGroup from "utils/sortTeamsByGroup";

type GameType = {
  first: TeamType[];
  second: TeamType[];
};

interface GroupCardContainerProps {
  teams: TeamType[];
}

const GroupCardContainer: FC<GroupCardContainerProps> = ({ teams }) => {
  // TODO: Create all possible pairs in group and create games in backend?
  const createAllPossiblePairsInGroup = (teams: TeamType[]) => {
    const sorted = sortTeamsByGroup(teams);
    const groupPairs = new Map<string, TeamType[][]>([]);

    for (const group of sorted.keys()) {
      const teams = sorted.get(group);

      if (!teams) return groupPairs;

      const allPossiblePairs: TeamType[][] = [];

      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          const player1 = teams[i];
          const player2 = teams[j];

          if (!player1 || !player2) return groupPairs;

          allPossiblePairs.push([player1, player2]);
        }

        groupPairs.set(group, allPossiblePairs);
      }
    }

    return groupPairs;
  };

  const containsObject = (obj: TeamType, list: TeamType[]) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i]?.id === obj.id) {
        return true;
      }
    }

    return false;
  };

  // Create games of pairs
  const createGames = (pairs: Map<string, TeamType[][]>) => {
    const games = new Map<string, GameType[]>([]);

    console.log("pairs ---->", pairs);

    for (const group of pairs.keys()) {
      const teams = pairs.get(group);

      if (!teams) return games;

      const allPossiblePairs = teams;

      console.log("allPossiblePairs", group, allPossiblePairs);

      for (let i = 0; i < allPossiblePairs.length; i++) {
        const firstPair = allPossiblePairs[i];

        if (!firstPair) return games;

        for (let j = i + 1; j < allPossiblePairs.length; j++) {
          const secondPair = allPossiblePairs[j];

          if (!secondPair || !firstPair[0] || !firstPair[1]) return games;

          if (
            !containsObject(firstPair[0], secondPair) &&
            !containsObject(firstPair[1], secondPair)
          ) {
            const game: GameType = {
              first: firstPair,
              second: secondPair,
            };

            const test = games.get(group);

            if (test) {
              test.push(game);
              break;
            }

            games.set(group, [game]);
          }
        }
      }
    }

    console.log("games", games);

    // return games;
  };

  return (
    <div>
      {createGames(createAllPossiblePairsInGroup(teams))}
      <GridLayout minWith="320" isGap>
        {[...sortTeamsByGroup(teams)].map(([group, value]) => {
          return (
            <div
              key={group}
              className="grid min-h-[20rem] min-w-[20rem] grid-cols-1 content-start rounded-md border border-gray-50 bg-gray-50 px-8 py-3 shadow-md"
            >
              <div>
                <p className="mb-5 text-sm text-gray-400">Group - {group}</p>
              </div>
              {value.map((team, i) => {
                const isFirstGroup = i === 0;
                return (
                  <div
                    key={`${i}${team.id}`}
                    className={classNames(
                      !isFirstGroup && "border-t-2",
                      "flex items-center justify-between py-2"
                    )}
                  >
                    <p>{team.name}</p>
                    <p>{team.score}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
};

export default GroupCardContainer;
