import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tasks } from "./dataset";

export default function MainScreen() {
    const navigate = useNavigate();
    const [, force] = useState(0); // bump to re-render after deletes

    // unique dates, newest → oldest
    const datesDesc = [...new Set(Tasks.map(t => t.assignedDate))]
        .sort((a, b) => b.localeCompare(a));

    const deleteByDate = (date) => {
        const keep = Tasks.filter(t => t.assignedDate !== date);
        // mutate the shared array **in place** (don’t reassign)
        Tasks.splice(0, Tasks.length, ...keep);
        force(x => x + 1);
    };

    return (
        <div className="mainscreen-container">
            <div className="toolbar">
                <button className="btn btn-primary" onClick={() => navigate("/addtask")}>
                    + Add task
                </button>
            </div>

            <h2 className="page-title">Task Dates</h2>

            <ul className="contact-list">
                {datesDesc.length ? (
                    datesDesc.map((date) => {
                        const count = Tasks.filter(t => t.assignedDate === date).length;
                        return (
                            <li key={date} className="contact-row">
                                <button
                                    className="contact-main"
                                    onClick={() => navigate(`/displaytask/${date}`)}
                                >
                                    <span className="contact-title">{date}</span>
                                    <span className="contact-sub">{count} task{count !== 1 ? "s" : ""}</span>
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
                    <li className="empty">No dates yet. Add your first task.</li>
                )}
            </ul>
        </div>
    );
}
