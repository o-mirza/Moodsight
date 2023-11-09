import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from 'react-redux';
// import { setData } from './moodSlice.js'

function Project(props) {
    const { _id, project_name } = props.project;
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        getData();
    }, [props, data]);

    function getData() {
        fetch('/api/getData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: _id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) setData(data);
                else (setData(null))
                return;
            })
            .catch(e => console.log('Error getting data. ', e));
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('project_id', _id);

        fetch('/api/processFile', {
            method: 'POST',
            body: formData
        })
            .then(res => res.text())
            .then(data => setData(data))
            .catch(e => console.log('Error uploading file. ', e));
    };

    let dataBundle = [];
    if (data) {
        for (let el of data) {
            dataBundle.push(<>
                <tr>
                    <td className="sentiment"><div id="score" className={"score" + el.sentiment}>{el.sentiment}</div></td>
                    <td>{el.category}</td>
                    <td>{el.verbatim}</td></tr>
            </>)
        }
    }

    if (data) return (
        <>
            <h1>{`${project_name} (project ID: ${_id})`}</h1>
            <table id="dataTable">
                <tr>
                    <th>Sentiment</th>
                    <th>Category</th>
                    <th>Verbatim</th>
                </tr>
                {dataBundle}
            </table>
        </>
    )
    else return (
        <>
            <h1>{`${project_name} (project ID: ${_id})`}</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" name="file" onChange={handleFileChange} /><br />
                <button type="submit">Upload</button>
            </form>
        </>
    )
}

export default Project