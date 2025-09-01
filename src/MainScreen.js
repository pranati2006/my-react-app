import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
//import AddTasks from "./AddTasks";
import DisplayTasks from "./DisplayTasks";

function MainScreen() {
    const navigate = useNavigate();

    const [tasks] = useState([
        {
            id: 1,
            title: "Task A",
            assignedDate: "2025-09-01",
            finishTime: "15:00",
            finish: false
        },
        {
            id: 2,
            title: "Task B",
            assignedDate: "2025-09-02",
            finishTime: "14:00",
            finish: false
        },
        {
            id: 3,
            title: "Task C",
            assignedDate: "2025-09-01",
            finishTime: "18:00",
            finish: false
        },
    ]);
    const uniqueDates = [...new Set(tasks.map((t) => t.assignedDate))];

    const handleDateClick = (date) => {
        alert("Date clicked:" + date);
    };

    const addATask = () => {
        alert("add clciked");
        navigate(`/addtask`);
    }

    return (
        <div className="main-container">
            <button onClick={addATask}>add</button>
            <h2>Task Dates</h2>
            <div className="date-list">
                {uniqueDates.map((date) => (
                    <div
                        key={date}
                        className="date-item"
                        onClick={() => handleDateClick(date)}
                    >
                        {date}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainScreen;
