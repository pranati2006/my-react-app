// src/DisplayTasks.js
import React, { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { loadTasks, saveTasks } from "./dataset";

export default function DisplayTasks() {
    const navigate = useNavigate();
    const { date } = useParams();
    const Tasks = loadTasks();

    const [filter, setFilter] = useState("all");
    const [, force] = useState(0);


    const [openIds, setOpenIds] = useState(() => new Set());
    const isOpen = (id) => openIds.has(id);
    const toggleOpen = (id) => {
        setOpenIds((s) => {
            const n = new Set(s);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    };

    if (!date) return <Navigate to="/" replace />;

    const byDate = (t) => t.assignedDate === date;
    const byStatus = (t) =>
        filter === "finished" ? t.finish :
            filter === "unfinished" ? !t.finish : true;

    const visible = Tasks
        .filter(byDate)
        .filter(byStatus)
        .sort((a, b) => a.id - b.id);


    const handleFinish = (id) => {
        const i = Tasks.findIndex((t) => t.id === id);
        if (i !== -1) {
            const task = Tasks[i];
            const next = !task.finish;
            task.finish = next;

            if (next && Array.isArray(task.subtasks) && task.subtasks.length) {
                task.subtasks = task.subtasks.map((s) => ({ ...s, finish: true }));
            }
            force((x) => x + 1);
            saveTasks(Tasks);
        }
    };

    const handleDelete = (id) => {
        const i = Tasks.findIndex((t) => t.id === id);
        if (i !== -1) {
            Tasks.splice(i, 1);
            force((x) => x + 1);
        }
        saveTasks(Tasks);
    };


    const toggleSubFinish = (taskId, subIdx) => {
        const ti = Tasks.findIndex((t) => t.id === taskId);
        if (ti === -1) return;

        const task = Tasks[ti];
        if (!Array.isArray(task.subtasks) || !task.subtasks[subIdx]) return;

        task.subtasks[subIdx].finish = !task.subtasks[subIdx].finish;


        if (task.subtasks.length) {
            task.finish = task.subtasks.every((s) => s.finish);
        }

        force((x) => x + 1);
        saveTasks(Tasks);
    };

    return (
        <div className="tasks-container">
            <div className="toolbar">
                <button className="btn btn-secondary" onClick={() => navigate("/")}>← Back</button>
                <div style={{ flex: 1 }} />
                <button className="btn btn-primary" onClick={() => navigate(`/addtask?date=${date}`)}>+ Add task</button>
            </div>

            <h2 className="page-title">Tasks on {date}</h2>

            <div className="toolbar" style={{ justifyContent: "flex-start", gap: 12 }}>
                <label className="label" htmlFor="statusFilter">Show:</label>
                <select
                    id="statusFilter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="unfinished">Unfinished</option>
                    <option value="finished">Finished</option>
                </select>
            </div>

            <ul className="contact-list">
                {visible.length ? (
                    visible.map((task) => {
                        const hasSubs = Array.isArray(task.subtasks) && task.subtasks.length > 0;
                        const subtaskcount = hasSubs ? task.subtasks.length : 0;
                        const open = isOpen(task.id);

                        return (
                            <li key={task.id} className="contact-row task-card">

                                <div
                                    className="task-main"

                                >
                                    <div className="task-title-line" onClick={() => { if (hasSubs) toggleOpen(task.id); }}>
                                        <span className={task.finish ? "task-name-finish" : "task-name-notfinish"}>
                                            {task.title}
                                        </span>
                                    </div>
                                    {hasSubs && (<div className="subtask-count"  >{subtaskcount} subtask{subtaskcount > 1 ? "s" : ""}</div>)}
                                    {task.description && (
                                        <div className="task-desc">{task.description}</div>
                                    )}

                                    {hasSubs && open && (
                                        <ul className="subtask-list inside">
                                            {task.subtasks.map((s, idx) => (
                                                <li key={idx} className="subtask-item">
                                                    <button
                                                        type="button"
                                                        className={`bullet ${s.finish ? "bullet-done" : ""}`}
                                                        onClick={() => toggleSubFinish(task.id, idx)}
                                                    />
                                                    <span className={`subtask-text ${s.finish ? "line-through" : ""}`}>
                                                        {s.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                </div>

                                <button
                                    className="icon-btn icon-edit"
                                    onClick={() => navigate(`/addtask/${task.id}`)}
                                    aria-label="Modify task"
                                    title="Modify"
                                >
                                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                                    </svg>
                                </button>

                                <button
                                    className="icon-btn icon-trash"
                                    onClick={() => handleDelete(task.id)}
                                    aria-label="Delete task"
                                    title="Delete"
                                >
                                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                        <path d="M9 3h6v2h5v2H4V5h5V3zm1 6h2v8h-2V9zm4 0h2v8h-2V9z" fill="currentColor" />
                                    </svg>
                                </button>

                                <button
                                    className={`finish-bar ${task.finish ? "is-finished" : ""}`}
                                    onClick={() => handleFinish(task.id)}
                                >
                                    {task.finish ? "Mark Unfinished" : "Mark Finished"}
                                </button>


                            </li>
                        );
                    })
                ) : (
                    <li className="empty">No tasks for {date}.</li>
                )}
            </ul>
        </div>
    );
}
