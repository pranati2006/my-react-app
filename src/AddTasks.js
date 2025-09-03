import React, { useState } from "react";
import { useParams, useNavigate, Navigate, useLocation } from "react-router-dom";
import { loadTasks, saveTasks } from "./dataset";

export default function AddTasks() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const Tasks = loadTasks();

    const isEdit = !!id;
    const existing = isEdit ? Tasks.find((t) => t.id === Number(id)) : null;

    const search = new URLSearchParams(location.search);
    const presetDate = !isEdit ? (search.get("date") || "") : "";

    const [form, setForm] = useState(() =>
        existing
            ? {
                title: existing.title,
                assignedDate: existing.assignedDate,
                description: existing.description ?? "",
                subtasks: Array.isArray(existing.subtasks) ? existing.subtasks : [],
            }
            : { title: "", assignedDate: presetDate, description: "", subtasks: [] }
    );

    const [invalid, setInvalid] = useState({ title: false, assignedDate: false });
    const [subName, setSubName] = useState("");

    if (isEdit && !existing) return <Navigate to="/" replace />;

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const onFieldFocus = (e) => {
        const { name } = e.target;
        setInvalid((iv) => ({ ...iv, [name]: false }));
    };

    const addSubtask = () => {
        const name = subName.trim();
        if (!name) return;
        setForm((f) => ({ ...f, subtasks: [...f.subtasks, { name, finish: false }] }));
        setSubName("");
    };

    const removeSubtask = (idx) => {
        setForm((f) => {
            const next = f.subtasks.slice();
            next.splice(idx, 1);
            return { ...f, subtasks: next };
        });
    };

    const onSubKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSubtask();
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const safeTitle = (form.title || "").trim();
        const safeDate = form.assignedDate;
        const safeDesc = (form.description || "").replace(/\r\n/g, "\n").trim();

        const nextInvalid = { title: !safeTitle, assignedDate: !safeDate };
        setInvalid(nextInvalid);
        if (nextInvalid.title || nextInvalid.assignedDate) return;

        if (isEdit) {
            const i = Tasks.findIndex((t) => t.id === Number(id));
            if (i !== -1) {
                Tasks[i] = {
                    ...Tasks[i],
                    title: safeTitle,
                    assignedDate: safeDate,
                    description: safeDesc,
                    subtasks: form.subtasks,
                    finish: existing.finish ?? false,
                };
            }
            saveTasks(Tasks);
            navigate(`/displaytask/${safeDate}`);
            return;
        }

        const nextId = Tasks.length ? Math.max(...Tasks.map((t) => t.id)) + 1 : 1;
        Tasks.push({
            id: nextId,
            title: safeTitle,
            assignedDate: safeDate,
            description: safeDesc,
            subtasks: form.subtasks,
            finish: false,
        });
        saveTasks(Tasks);
        navigate(`/displaytask/${safeDate}`);
    };

    return (
        <div className="addtask-container">
            <h2 className="page-title">{isEdit ? "Modify Task" : "Add Task"}</h2>

            <form onSubmit={onSubmit} className="form" noValidate>
                <div className="form-row">
                    <label className="label" htmlFor="title">Title</label>
                    <input
                        id="title"
                        className={`input ${invalid.title ? "invalid" : ""}`}
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        onFocus={onFieldFocus}
                        required
                        placeholder="e.g. Write report"
                    />
                </div>

                <div className="form-row">
                    <label className="label" htmlFor="assignedDate">Assigned Date</label>
                    <input
                        id="assignedDate"
                        className={`input ${invalid.assignedDate ? "invalid" : ""}`}
                        type="date"
                        name="assignedDate"
                        value={form.assignedDate}
                        onChange={onChange}
                        onFocus={onFieldFocus}
                        required
                    />
                </div>

                <div className="form-row">
                    <label className="label" htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        className="textarea task-desc"
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        rows={3}
                        placeholder="Optional notes…"
                    />
                </div>

                <div className="form-row">
                    <label className="label">Subtasks</label>
                    <div className="subtask-inputs">
                        <input
                            className="input"
                            placeholder="Subtask name"
                            value={subName}
                            onChange={(e) => setSubName(e.target.value)}
                            onKeyDown={onSubKeyDown}
                        />
                        <button type="button" className="btn" onClick={addSubtask}>
                            Add
                        </button>
                    </div>

                    {form.subtasks.length > 0 && (
                        <ul className="subtask-list">
                            {form.subtasks.map((s, idx) => (
                                <li key={idx} className="subtask-item">
                                    <span className="bullet-preview" >•</span>
                                    <span className="subtask-text">{s.name}</span>
                                    <button
                                        style={{ marginLeft: "auto" }}
                                        type="button"
                                        className="btn btn-danger-outline btn-xxs"
                                        onClick={() => removeSubtask(idx)}
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="actions">
                    <button type="submit" className="btn btn-primary">
                        {isEdit ? "Save changes" : "Add"}
                    </button>
                    <button type="button" className="btn" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
