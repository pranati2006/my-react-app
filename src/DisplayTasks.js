import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DisplayTasks() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([
        { id: 1, title: "Task A", assignedDate: "2025-09-01", finishTime: "15:00", finish: false },
        { id: 2, title: "Task B", assignedDate: "2025-09-02", finishTime: "14:00", finish: true },
        { id: 3, title: "Task C", assignedDate: "2025-09-01", finishTime: "18:00", finish: false },
    ]);

    const [filter, setFilter] = useState("all"); // all | finished | unfinished

    const handleFinish = (id) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, finish: !task.finish } : task
            )
        );
    };

    const handleDelete = (id) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const goback = () => {
        navigate(`/`);
    };

    // Filter tasks based on selected option
    const filteredTasks = tasks.filter((task) => {
        if (filter === "finished") return task.finish;
        if (filter === "unfinished") return !task.finish;
        return true; // "all"
    });

    return (
        <div className="tasks-container">
            <button onClick={goback}>back</button>
            <h2>Tasks</h2>

            {/* Filter selector */}
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
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <div key={task.id} className="task-item">
                            <div
                                className={
                                    task.finish ? "task-name-finish" : "task-name-notfinish"
                                }
                                onClick={() => handleFinish(task.id)}
                            >
                                {task.title}
                            </div>
                            <button
                                className="task-button"
                                onClick={() => handleDelete(task.id)}
                            >
                                delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No tasks to show</p>
                )}
            </div>
        </div>
    );
}

export default DisplayTasks;
