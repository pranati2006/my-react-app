import React, { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Tasks } from "./dataset";

export default function DisplayTasks() {
    const { date } = useParams();                 // e.g. "2025-09-01" or undefined


    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");   // all | finished | unfinished
    const [, force] = useState(0);                 // bump to re-render after mutations

    // Filter: first by date param (exact match—no URI encoding needed), then by status
    if (!date) return <Navigate to="/" replace />; // no date → go home

    const filteredTasks = Tasks
        .filter(t => t.assignedDate === date)
        .filter(t => (filter === "finished" ? t.finish : filter === "unfinished" ? !t.finish : true));

    const handleFinish = (id) => {
        const i = Tasks.findIndex((t) => t.id === id);
        if (i !== -1) {
            Tasks[i].finish = !Tasks[i].finish;
            force((x) => x + 1);
        }
    };

    const handleDelete = (id) => {
        const i = Tasks.findIndex((t) => t.id === id);
        if (i !== -1) {
            Tasks.splice(i, 1);
            force((x) => x + 1);
        }
    };

    return (
        <div className="tasks-container">
            <button onClick={() => navigate("/")}>back</button>
            <h2>Tasks on {date}</h2>

            <div className="filter-container">
                <label htmlFor="filter">Show: </label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="unfinished">Unfinished</option>
                    <option value="finished">Finished</option>
                </select>
            </div>

            <div className="task-list">
                {filteredTasks.length ? (
                    filteredTasks.map((task) => (
                        <div key={task.id} className="task-item">
                            <div
                                className={task.finish ? "task-name-finish" : "task-name-notfinish"}
                                onClick={() => handleFinish(task.id)}
                            >
                                {task.title} — {task.finishTime} — {task.finish ? "Finished" : "Not finished"}
                            </div>
                            <button className="task-button" onClick={() => navigate(`/addtask/${task.id}`)}>
                                modify
                            </button>
                            <button className="task-button" onClick={() => handleDelete(task.id)}>
                                delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No tasks for {date}.</p>
                )}
            </div>
        </div>
    );
}
