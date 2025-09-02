
export functionloadTasks(){

    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : [];

}
export function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
