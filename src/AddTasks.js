import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tasks } from "./dataset";

function AddTasks() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [assignedDate, setAssignedDate] = useState("");
    const [finishTime, setFinishTime] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        Tasks.push({
            id: Tasks.length + 1,
            title: title.trim(),
            assignedDate,      // "YYYY-MM-DD"
            finishTime,        // "HH:mm"
            finish: false,
        });


        alert("New Task:" + JSON.stringify(Tasks[Tasks.length - 1]));


        setTitle("");
        setAssignedDate("");
        setFinishTime("");
    };
    const goback = () => {
        navigate(`/`);
    }

    return (

        <div className="container">
            <button onClick={goback}>back</button>
            <h2>Add Task</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title: </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Assigned Date: </label>
                    <input
                        type="date"
                        value={assignedDate}
                        onChange={(e) => setAssignedDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Finish Time: </label>
                    <input
                        type="time"
                        value={finishTime}
                        onChange={(e) => setFinishTime(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Add</button>
            </form>
        </div>
    );
}

export default AddTasks;
