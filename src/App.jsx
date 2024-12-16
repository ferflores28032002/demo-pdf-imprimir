// App.js
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    team: "",
    position: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch data from API
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((users) => {
        const formattedData = users.map((user) => ({
          id: user.id,
          name: user.name,
          team: "Team " + user.company.name,
          position: "Position " + user.username,
        }));
        setData(formattedData);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCreate = () => {
    if (!form.name || !form.team || !form.position) return;
    setData([...data, { ...form, id: Date.now() }]);
    setForm({ id: null, name: "", team: "", position: "" });
  };

  const handleEdit = (id) => {
    const record = data.find((item) => item.id === id);
    setForm(record);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    setData(data.map((item) => (item.id === form.id ? form : item)));
    setForm({ id: null, name: "", team: "", position: "" });
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const handleDownloadPDF = (row) => {
    const doc = new jsPDF();
    doc.text("Player Details", 14, 10);
    doc.autoTable({
      head: [["Field", "Value"]],
      body: [
        ["Name", row.name],
        ["Team", row.team],
        ["Position", row.position],
      ],
    });
    doc.save(`${row.name}.pdf`);
  };

  const handlePrint = (row) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      `<html><head><title>Print Player Details</title><style>` +
        `body { font-family: Arial, sans-serif; padding: 20px; }` +
        `h1 { color: #4caf50; }` +
        `p { margin: 5px 0; }` +
        `.logo { text-align: center; margin-bottom: 20px; }` +
        `.logo img { max-width: 150px; }` +
        `</style></head><body>` +
        `<div class="logo"><img src="https://via.placeholder.com/150" alt="Logo" /></div>` +
        `<h1>Player Details</h1>` +
        `<p><strong>Name:</strong> ${row.name}</p>` +
        `<p><strong>Team:</strong> ${row.team}</p>` +
        `<p><strong>Position:</strong> ${row.position}</p>` +
        `</body></html>`
    );
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="container">
      <h1>Football Players CRUD</h1>
      <div className="form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="team"
          placeholder="Team"
          value={form.team}
          onChange={handleChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
        />
        <button onClick={isEditing ? handleUpdate : handleCreate}>
          {isEditing ? "Update" : "Create"}
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.team}</td>
              <td>{row.position}</td>
              <td style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <button
                  style={{ background: "blue", color: "white" }}
                  onClick={() => handleEdit(row.id)}
                >
                  Edit
                </button>
                <button
                  style={{ background: "red", color: "white" }}
                  onClick={() => handleDelete(row.id)}
                >
                  Delete
                </button>
                <button
                  style={{ background: "green", color: "white" }}
                  onClick={() => handleDownloadPDF(row)}
                >
                  Download PDF
                </button>
                <button
                  style={{ background: "purple", color: "white" }}
                onClick={() => handlePrint(row)}>Print</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
