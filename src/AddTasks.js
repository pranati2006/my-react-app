import React, { useEffect, useState } from "react";

function AddTasks() {
    const [title, setTitle] = useState("");
    const [assignedDate, setAssignedDate] = useState("");
    const [finishTime, setFinishTime] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTask = {
            id: 1, // fixed for now
            title,
            assignedDate,
            finishTime,
            finish: false
        };


        console.log("New Task:", newTask);
        alert("Task added: " + JSON.stringify(newTask));


        setTitle("");
        setAssignedDate("");
        setFinishTime("");
    };

    return (
        <div className="container">
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
