import React, { useState } from "react";
import { useParams, useNavigate, Navigate, useLocation } from "react-router-dom";
import { Tasks } from "./dataset";

export default function AddTasks() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const isEdit = !!id;
    const existing = isEdit ? Tasks.find((t) => t.id === Number(id)) : null;

    // read ?date=YYYY-MM-DD for create flow
    const search = new URLSearchParams(location.search);
    const presetDate = !isEdit ? (search.get("date") || "") : ""; // ignore if editing


    const [form, setForm] = useState(() =>
        existing
            ? {
                title: existing.title,
                assignedDate: existing.assignedDate,
                description: existing.description ?? "",
            }
            : { title: "", assignedDate: presetDate, description: "" }
    );



    // track which fields are currently marked invalid (to add red outline)
    const [invalid, setInvalid] = useState({ title: false, assignedDate: false });

    // invalid id → safe redirect
    if (isEdit && !existing) return <Navigate to="/" replace />;

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    // clear red outline as soon as user focuses the field
    const onFieldFocus = (e) => {
        const { name } = e.target;
        setInvalid((iv) => ({ ...iv, [name]: false }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const safeTitle = (form.title || "").trim();
        const safeDate = form.assignedDate;
        const safeDesc = (form.description || "").trim();

        // validate and mark invalid fields
        const nextInvalid = {
            title: !safeTitle,
            assignedDate: !safeDate,
        };
        setInvalid(nextInvalid);

        // if any invalid, stop here (red outline stays until focus)
        if (nextInvalid.title || nextInvalid.assignedDate) return;

        if (isEdit) {
            const i = Tasks.findIndex((t) => t.id === Number(id));
            if (i !== -1) {
                Tasks[i] = {
                    ...Tasks[i],
                    title: safeTitle,
                    assignedDate: safeDate,
                    description: safeDesc,
                };
            }
            navigate(`/displaytask/${safeDate}`);
            return;
        }

        const nextId = Tasks.length ? Math.max(...Tasks.map((t) => t.id)) + 1 : 1;
        Tasks.push({
            id: nextId,
            title: safeTitle,
            assignedDate: safeDate,
            description: safeDesc,
            finish: false,
        });

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
                        aria-invalid={invalid.title ? "true" : "false"}
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
                        aria-invalid={invalid.assignedDate ? "true" : "false"}
                    />
                </div>

                <div className="form-row">
                    <label className="label" htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        className="textarea"
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        rows={3}
                        placeholder="Optional notes…"
                    />
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
