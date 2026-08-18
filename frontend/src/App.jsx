import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Login from "./Login";
import "./App.css";

const API_URL = "https://habittrackz.onrender.com";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access")
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return <HabitTracker onLogout={handleLogout} />;
}

function HabitTracker({ onLogout }) {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);

  const [editingHabit, setEditingHabit] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date());

  const scrollRef = useRef(null);

  const token = localStorage.getItem("access");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const habitsResponse = await axios.get(
        `${API_URL}/api/habits/`,
        authConfig
      );

      const logsResponse = await axios.get(
        `${API_URL}/api/habit-logs/`,
        authConfig
      );

      setHabits(habitsResponse.data);
      setLogs(logsResponse.data);
    } catch (error) {
      console.error(
        "FETCH ERROR:",
        error.response?.data || error
      );
    }
  };

  /* =========================
     MONTH
  ========================= */

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const dates = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(year, month, i + 1)
  );

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  /* =========================
     ADD HABIT
  ========================= */

  const addHabit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const description = e.target.description.value;

    try {
      const response = await axios.post(
        `${API_URL}/api/habits/`,
        {
          name,
          description,
        },
        authConfig
      );

      setHabits((currentHabits) => [
        ...currentHabits,
        response.data,
      ]);

      e.target.reset();
    } catch (error) {
      console.error(
        "ADD HABIT ERROR:",
        error.response?.data || error
      );
    }
  };

  /* =========================
     EDIT HABIT
  ========================= */

  const startEditing = (habit) => {
    setEditingHabit(habit.id);
    setEditName(habit.name);
    setEditDescription(habit.description);
  };

  const cancelEditing = () => {
    setEditingHabit(null);
    setEditName("");
    setEditDescription("");
  };

  const updateHabit = async (habitId) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/habits/${habitId}/`,
        {
          name: editName,
          description: editDescription,
        },
        authConfig
      );

      setHabits((currentHabits) =>
        currentHabits.map((habit) =>
          habit.id === habitId
            ? response.data
            : habit
        )
      );

      cancelEditing();
    } catch (error) {
      console.error(
        "UPDATE HABIT ERROR:",
        error.response?.data || error
      );
    }
  };

  /* =========================
     DELETE HABIT
  ========================= */

  const deleteHabit = async (habitId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this habit?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/api/habits/${habitId}/`,
        authConfig
      );

      setHabits((currentHabits) =>
        currentHabits.filter(
          (habit) => habit.id !== habitId
        )
      );

      setLogs((currentLogs) =>
        currentLogs.filter(
          (log) => log.habit !== habitId
        )
      );
    } catch (error) {
      console.error(
        "DELETE HABIT ERROR:",
        error.response?.data || error
      );
    }
  };

  /* =========================
     LOG FUNCTIONS
  ========================= */

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const d = String(
      date.getDate()
    ).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  const getLog = (habitId, date) => {
    const fullDate = formatDate(date);

    return logs.find(
      (log) =>
        log.habit === habitId &&
        log.date === fullDate
    );
  };

  const toggleHabit = async (
    habitId,
    date
  ) => {
    const fullDate = formatDate(date);

    const existingLog = getLog(
      habitId,
      date
    );

    try {
      if (existingLog) {
        const response = await axios.patch(
          `${API_URL}/api/habit-logs/${existingLog.id}/`,
          {
            is_done: !existingLog.is_done,
          },
          authConfig
        );

        setLogs((currentLogs) =>
          currentLogs.map((log) =>
            log.id === existingLog.id
              ? response.data
              : log
          )
        );
      } else {
        const response = await axios.post(
          `${API_URL}/api/habit-logs/`,
          {
            habit: habitId,
            date: fullDate,
            is_done: true,
          },
          authConfig
        );

        setLogs((currentLogs) => [
          ...currentLogs,
          response.data,
        ]);
      }
    } catch (error) {
      console.error(
        "TOGGLE ERROR:",
        error.response?.data || error
      );
    }
  };

  return (
    <div className="app">

      {/* =========================
          TOP BAR
      ========================= */}

      <header className="top-bar">

        <div>
          <h1>HabitTrackz</h1>
          <p>Small habits. Big changes.</p>
        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>

      </header>

      {/* =========================
          ADD HABIT
      ========================= */}

      <section className="add-section">

        <h2>Add Habit</h2>

        <form
          className="form-row"
          onSubmit={addHabit}
        >

          <div>
            <label>Habit Name</label>

            <input
              type="text"
              name="name"
              placeholder="Example: Reading"
              required
            />
          </div>

          <div>
            <label>Description</label>

            <input
              type="text"
              name="description"
              placeholder="Example: Read for 30 minutes"
              required
            />
          </div>

          <button type="submit">
            Add Habit
          </button>

        </form>

      </section>

      {/* =========================
          TRACKER
      ========================= */}

      <section className="tracker-section">

        <div className="tracker-heading">

          <button
            onClick={previousMonth}
            className="month-button"
          >
            ←
          </button>

          <h2>
            {monthName} {year}
          </h2>

          <button
            onClick={nextMonth}
            className="month-button"
          >
            →
          </button>

        </div>

        {/* =========================
            SCROLL AREA
        ========================= */}

        <div
          className="tracker-wrapper"
          ref={scrollRef}
        >

          <table className="habit-table">

            <thead>

              {/* WEEKDAYS */}

              <tr>

                <th
                  className="habit-header"
                  rowSpan="2"
                >
                  Habit
                </th>

                {dates.map((date) => (
                  <th
                    key={date.toISOString()}
                    className="day-header"
                  >
                    {date.toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                      }
                    )}
                  </th>
                ))}

              </tr>

              {/* DATES */}

              <tr>

                {dates.map((date) => (
                  <th
                    key={date.toISOString()}
                    className="date-header"
                  >
                    {date.getDate()}
                  </th>
                ))}

              </tr>

            </thead>

            <tbody>

              {habits.map((habit) => (

                <tr key={habit.id}>

                  <td className="habit-cell">

                    {editingHabit === habit.id ? (

                      <div className="edit-box">

                        <input
                          value={editName}
                          onChange={(e) =>
                            setEditName(
                              e.target.value
                            )
                          }
                        />

                        <input
                          value={editDescription}
                          onChange={(e) =>
                            setEditDescription(
                              e.target.value
                            )
                          }
                        />

                        <div>

                          <button
                            onClick={() =>
                              updateHabit(
                                habit.id
                              )
                            }
                          >
                            Save
                          </button>

                          <button
                            onClick={
                              cancelEditing
                            }
                          >
                            Cancel
                          </button>

                        </div>

                      </div>

                    ) : (

                      <>

                        <strong>
                          {habit.name}
                        </strong>

                        <p>
                          {habit.description}
                        </p>

                        <button
                          onClick={() =>
                            startEditing(habit)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteHabit(habit.id)
                          }
                        >
                          🗑️ Delete
                        </button>

                      </>

                    )}

                  </td>

                  {dates.map((date) => {

                    const log = getLog(
                      habit.id,
                      date
                    );

                    return (

                      <td
                        key={date.toISOString()}
                        className="check-cell"
                      >

                        <button
                          className={
                            log?.is_done
                              ? "check-button done"
                              : "check-button"
                          }
                          onClick={() =>
                            toggleHabit(
                              habit.id,
                              date
                            )
                          }
                        >
                          {log?.is_done
                            ? "✓"
                            : "○"}
                        </button>

                      </td>

                    );

                  })}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default App;