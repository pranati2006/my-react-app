import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import AddTasks from "./AddTasks";
import { Tasks } from "./dataset";
import DisplayTasks from "./DisplayTasks";

function MainScreen() {
    const navigate = useNavigate();

    const [uniqueDates, setUniqueDates] = useState([]);

    useEffect(() => {
        setUniqueDates([...new Set(Tasks.map(t => t.assignedDate))]);
    }, []);

    const handleDateClick = (date) => {
        alert("Date clicked:" + date);
        navigate(`/displaytask`);
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
