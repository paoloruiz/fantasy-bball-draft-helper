import "./styles.css";
import { players } from "./input/players";
import { PlayerTable } from "./components/PlayerTable";
import {
  PuntingCategories,
  PuntedCategory
} from "./components/PuntingCategories";
import { useState } from "react";

const dupe_players = JSON.parse(JSON.stringify(players));

export default function App() {
  const [categories, setCategories] = useState<PuntedCategory[]>([]);
  const updateCategory = (name: PuntedCategory) => {
    const ind = categories.indexOf(name);

    const newCategories = [...categories];
    if (ind > -1) {
      newCategories.splice(ind, 1);
    } else {
      newCategories.push(name);
    }

    setCategories(newCategories);
  };
  return (
    <div className="App">
      <PuntingCategories
        categories={categories}
        updateCategory={updateCategory}
      />
      <PlayerTable
        players={dupe_players}
        playersLeft={80}
        puntedCategories={categories}
      />
    </div>
  );
}
