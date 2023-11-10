import React, { useEffect, useState } from "react";
import Project from './project.js'

function App() {
    const [user, setUser] = useState('omirza@gmail.com');
    const [projectArr, setProjectArr] = useState([]);
    const [project, setProject] = useState(null);

    useEffect(() => {
        getProjectArr();
    }, [project]);

    function getProjectArr() {
        fetch('/api/getProjectArr')
            .then(res => res.json())
            .then(data => setProjectArr(data.reverse()))
            .catch(e => console.log('Error getting project array. ', e));
    }

    function handleClickNewProject() {
        const projectName = prompt("Enter project name");
        fetch('/api/newProject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectName: projectName })
        })
            .then(res => res.json())
            .then(data => setProject(data))
            .catch(e => console.log('Error creating new project. ', e));
    }

    const projectBundle = [];
    for (let el of projectArr) {
        const { _id, project_name } = el;
        const active = (project && _id === project._id) ? 'Active' : ''
        projectBundle.push(<><br /><button className={"navButton" + active} onClick={() => setProject({ _id: _id, project_name: project_name })}>{project_name}</button></>)
    }

    if (project) return (
        <div id="container">
            <nav id="sidebar">
                <div id="nav">
                    <h2>Moodsight AI</h2>
                    <button id="newProjectButton" onClick={handleClickNewProject}>+ New Project</button>
                    {projectBundle}
                </div>
                <div id="user">
                    <img src="https://imgur.com/l4Jus77.png" height="20" /> omirza@gmail.com ▲
                </div>
            </nav>
            <div id="content">
                <Project project={project} />
            </div>
        </div>
    );
    else return (
        <div id="container">
            <nav id="sidebar">
                <div id="nav">
                    <h2>Moodsight AI</h2>
                    <button id="newProjectButton" onClick={handleClickNewProject}>+ New Project</button>
                    {projectBundle}
                </div>
                <div id="user">
                    <img src="https://imgur.com/l4Jus77.png" height="20" /> omirza@gmail.com ▲
                </div>
            </nav>
            <div id="content">
                <br /><br /><br /><br /><br /><br /><br />
                <h1>No project selected.</h1>
            </div>
        </div>
    );
}

export default App