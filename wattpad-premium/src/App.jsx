import { useState, useEffect } from "react";
import "./index.css";

export default function App() {

  // 🔒 LOGIN
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "marlene123") setIsLogged(true);
    else alert("Mot de passe incorrect");
  };

  // 🌗 THEME
  const [theme, setTheme] = useState("dark");

  // 📚 STORIES
  const [stories, setStories] = useState(() => {
    const saved = localStorage.getItem("stories");
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Mon Roman", content: "" }
    ];
  });

  const [activeId, setActiveId] = useState(stories[0].id);
  const [mode, setMode] = useState("edit");

  const activeStory = stories.find(s => s.id === activeId);

  useEffect(() => {
    localStorage.setItem("stories", JSON.stringify(stories));
  }, [stories]);

  // ✍️ update contenu
  const updateContent = (value) => {
    setStories(stories.map(s =>
      s.id === activeId ? { ...s, content: value } : s
    ));
  };

  // 📝 update titre
  const updateTitle = (value) => {
    setStories(stories.map(s =>
      s.id === activeId ? { ...s, title: value } : s
    ));
  };

  // ➕ ajouter
  const addStory = () => {
    const newStory = {
      id: Date.now(),
      title: "Nouvelle histoire",
      content: ""
    };
    setStories([...stories, newStory]);
    setActiveId(newStory.id);
  };

  // 🗑️ supprimer
  const deleteStory = () => {
    if (stories.length === 1) {
      alert("Impossible de supprimer la dernière histoire");
      return;
    }

    const updated = stories.filter(s => s.id !== activeId);
    setStories(updated);
    setActiveId(updated[0].id);
  };

  // 🔒 LOGIN SCREEN
  if (!isLogged) {
    return (
      <div className="login">
        <h2>🔒 Accès privé</h2>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Entrer</button>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`}>

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>📚 Stories</h2>

        {stories.map(story => (
          <div
            key={story.id}
            className={`story ${story.id === activeId ? "active" : ""}`}
            onClick={() => setActiveId(story.id)}
          >
            {story.title}
          </div>
        ))}

        <button onClick={addStory}>+ Nouvelle</button>
      </div>

      {/* MAIN */}
      <div className="editor">

        <div className="topbar">
          <input
            value={activeStory.title}
            onChange={(e) => updateTitle(e.target.value)}
          />

          <div>
            <button onClick={() => setMode(mode === "edit" ? "read" : "edit")}>
              {mode === "edit" ? "📖" : "✍️"}
            </button>

            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              🌗
            </button>

            <button onClick={deleteStory}>🗑️</button>
          </div>
        </div>

        <div className={`content ${mode}`}>

          {mode === "edit" ? (
            <textarea
              value={activeStory.content}
              onChange={(e) => updateContent(e.target.value)}
            />
          ) : (
            <div className="reader">
              <h1>{activeStory.title}</h1>
              <p>{activeStory.content}</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}