import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tasks } from "./dataset";

export default function AddTasks() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = !!id;
    const existing = isEdit ? Tasks.find(t => t.id === Number(id)) : null;

    const [form, setForm] = useState(() => {
        if (existing) {
            return {
                title: existing.title,
                assignedDate: existing.assignedDate,
                finishTime: existing.finishTime,
            };
        }
        return { title: "", assignedDate: "", finishTime: "" };
    });

    if (isEdit && !existing) {
        // invalid id → bounce home (or show an error)
        navigate(`/`);
    }

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const { title, assignedDate, finishTime } = form;
        if (!title || !assignedDate || !finishTime) return;

        if (isEdit) {
            // update existing task in-place (keep finish flag)
            const i = Tasks.findIndex(t => t.id === Number(id));
            if (i !== -1) {
                Tasks[i] = {
                    ...Tasks[i],
                    title: title.trim(),
                    assignedDate,
                    finishTime,
                };
            }
            navigate(`/displaytask/${assignedDate}`);
            return;
        }

        // create new task
        const nextId = Tasks.length ? Math.max(...Tasks.map(t => t.id)) + 1 : 1;
        Tasks.push({
            id: nextId,
            title: title.trim(),
            assignedDate,
            finishTime,
            finish: false,
        });

        // after add, go to that date’s list
        navigate(`/displaytask/${assignedDate}`);
    };

    return (
        <div className="container">
            <h2>{isEdit ? "Modify Task" : "Add Task"}</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Title: </label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        required
                    />
                </div>

                <div>
                    <label>Assigned Date: </label>
                    <input
                        type="date"
                        name="assignedDate"
                        value={form.assignedDate}
                        onChange={onChange}
                        required
                    />
                </div>

                <div>
                    <label>Finish Time: </label>
                    <input
                        type="time"
                        name="finishTime"
                        value={form.finishTime}
                        onChange={onChange}
                        required
                    />
                </div>

                <div>
                    <button type="submit">{isEdit ? "Save changes" : "Add"}</button>
                    <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: 8 }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

}