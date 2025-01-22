import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import TaskDetail from "./components/TaskDetail";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./index.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TaskList />} />
                <Route path="/tasks/new" element={<TaskForm />} />
                <Route path="/tasks/edit/:id" element={<TaskForm />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
            </Routes>
        </Router>
    );
}

export default App;
