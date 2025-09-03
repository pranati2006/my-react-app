// MainScreen.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadTasks, saveTasks } from "./dataset";
import ThemeToggle from "./ThemeToggle";

function todayYMD() {
    // Stable YYYY-MM-DD, unaffected by timezone offsets
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
}

const FILTERS = {
    ALL: "all",
    PAST: "past",
    DONE: "done",
};

export default function MainScreen() {
    const navigate = useNavigate();
    const [, force] = useState(0);

    const [filter, setFilter] = useState(FILTERS.ALL);

    const Tasks = loadTasks();
    const today = todayYMD();

    const datesDesc = [...new Set(Tasks.map((t) => t.assignedDate))].sort((a, b) =>
        b.localeCompare(a)
    );

    const isPastDateWithUnfinished = (date) => {
        const unfinishedCount = Tasks.filter(
            (t) => t.assignedDate === date && !t.finish
        ).length;
        return date < today && unfinishedCount > 0;
    };

    const isAllDoneOnDate = (date) => {
        const unfinishedCount = Tasks.filter(
            (t) => t.assignedDate === date && !t.finish
        ).length;
        return unfinishedCount === 0;
    };

    const visibleDates = datesDesc.filter((date) => {
        switch (filter) {
            case FILTERS.PAST:
                return isPastDateWithUnfinished(date);
            case FILTERS.DONE:
                return isAllDoneOnDate(date);
            case FILTERS.ALL:
            default:
                return true;
        }
    });

    const deleteByDate = (date) => {
        const keep = Tasks.filter((t) => t.assignedDate !== date);
        Tasks.splice(0, Tasks.length, ...keep);
        saveTasks(Tasks);
        force((x) => x + 1);
    };

    return (
        <div className="mainscreen-container">
            <div className="toolbar">
                <button className="btn btn-primary" onClick={() => navigate("/addtask")}>
                    +
                </button>

                {/* Filter control */}
                <select
                    aria-label="Filter dates"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value={FILTERS.ALL}>All dates</option>
                    <option value={FILTERS.PAST}>Past due</option>
                    <option value={FILTERS.DONE}>Fully done</option>
                </select>

                <ThemeToggle />
            </div>

            <h2 className="page-title">Task Dates</h2>

            <ul className="contact-list">
                {visibleDates.length ? (
                    visibleDates.map((date) => {
                        const count = Tasks.filter((t) => t.assignedDate === date).length;
                        const unfinishedCount = Tasks.filter(
                            (t) => t.assignedDate === date && !t.finish
                        ).length;

                        const isPast = date < today && unfinishedCount > 0;
                        const isDone = unfinishedCount === 0;

                        return (
                            <li
                                key={date}
                                className={`contact-row ${isPast ? "is-past" : ""} ${isDone ? "is-done" : ""
                                    }`}
                            >
                                <button
                                    className="contact-main"
                                    onClick={() => navigate(`/displaytask/${date}`)}
                                >
                                    <span className="contact-title">{date}</span>
                                    <span className="contact-sub">
                                        {count} task{count !== 1 ? "s" : ""}
                                        {isDone ? " • All done" : ""}
                                        {isPast ? ` • ${unfinishedCount} task${count !== 1 ? "s" : ""} past due date` : ""}
                                    </span>
                                </button>

                                <button
                                    className="btn btn-danger-outline"
                                    onClick={() => deleteByDate(date)}
                                    aria-label={`Delete all tasks on ${date}`}
                                >
                                    Delete
                                </button>
                            </li>
                        );
                    })
                ) : (
                    <li className="empty">No matching dates.</li>
                )}
            </ul>
        </div>
    );
}
