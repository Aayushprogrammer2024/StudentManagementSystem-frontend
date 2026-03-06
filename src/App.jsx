import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 2;

  useEffect(() => {
    loadStudents();
  }, [currentPage]);

  const loadStudents = () => {
    let url = search
      ? `https://studentmanagementsystem-backend-mxhw.onrender.com/students/search?name=${search}&page=${currentPage}&size=${pageSize}`
      : `https://studentmanagementsystem-backend-mxhw.onrender.com/students?page=${currentPage}&size=${pageSize}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setStudents(data.content);
        setTotalPages(data.totalPages);
      });
  };

  const saveStudent = () => {
    const method = studentId ? "PUT" : "POST";
    const url = studentId
      ? `https://studentmanagementsystem-backend-mxhw.onrender.com/students/${studentId}`
      : `https://studentmanagementsystem-backend-mxhw.onrender.com/students`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    }).then(() => {
      resetForm();
      loadStudents();
    });
  };

  const deleteStudent = (id) => {
    fetch(`https://studentmanagementsystem-backend-mxhw.onrender.com/students/${id}`, {
      method: "DELETE"
    }).then(() => loadStudents());
  };

  const editStudent = (student) => {
    setStudentId(student.id);
    setName(student.name);
    setEmail(student.email);
  };

  const resetForm = () => {
    setStudentId(null);
    setName("");
    setEmail("");
  };

  const searchStudents = () => {
    setCurrentPage(0);
    loadStudents();
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="container">

      <h2>Add / Update Student</h2>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="save-btn" onClick={saveStudent}>
        Save
      </button>

      <hr />

      <h2>Search Students</h2>

      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button className="search-btn" onClick={searchStudents}>
        Search
      </button>

      <hr />

      <h2>Students List</h2>

      <ul>
        {students.map(student => (
          <li key={student.id}>
            <span>{student.name} - {student.email}</span>
            <div className="button-group">
              <button
                className="edit-btn"
                onClick={() => editStudent(student)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteStudent(student.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="center">
        <button className="pagination-btn" onClick={previousPage}>
          Previous
        </button>

        <span>
          Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}
        </span>

        <button className="pagination-btn" onClick={nextPage}>
          Next
        </button>
      </div>

    </div>
  );
}

export default App;