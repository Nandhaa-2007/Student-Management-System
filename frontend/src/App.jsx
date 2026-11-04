
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Get students from MongoDB
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      alert("Backend connection failed. Check your backend terminal.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add student to MongoDB
  const addStudent = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !course.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          course,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add student");
      }

      setStudents((previous) => [...previous, data]);

      setName("");
      setEmail("");
      setCourse("");

      alert("Student added successfully!");
    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete student from MongoDB
  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete student");
      }

      setStudents((previous) =>
        previous.filter((student) => student._id !== id)
      );

      alert("Student deleted successfully!");
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalCourses = new Set(
    students.map((student) => student.course)
  ).size;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f4f6fb;
          color: #222;
        }
        .navbar {
          background: #263b80;
          color: white;
          padding: 22px 7%;
          font-size: 23px;
          font-weight: bold;
        }
        .container {
          max-width: 1100px;
          margin: 35px auto;
          padding: 0 20px;
        }
        .welcome { margin-bottom: 25px; }
        .welcome h1 { color: #263b80; }
        .cards {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }
        .card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          flex: 1;
          box-shadow: 0 3px 12px #00000010;
        }
        .card h2 { color: #263b80; font-size: 30px; }
        .panel {
          background: white;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 25px;
          box-shadow: 0 3px 12px #00000010;
        }
        input {
          width: 100%;
          padding: 13px;
          margin: 8px 0 15px;
          border: 1px solid #ddd;
          border-radius: 7px;
        }
        button {
          background: #263b80;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 7px;
          cursor: pointer;
        }
        button:hover { background: #17285e; }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .delete { background: #dc3545; }
        .table-wrap { overflow-x: auto; }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 500px;
        }
        th, td {
          padding: 14px;
          border-bottom: 1px solid #eee;
          text-align: left;
        }
        th { background: #edf0fa; }
        .search { max-width: 350px; }
        @media(max-width: 600px) {
          .cards { flex-direction: column; }
          .container { margin-top: 20px; }
        }
      `}</style>

      <div className="navbar">
        🎓 Student Management System
      </div>

      <div className="container">
        <div className="welcome">
          <h1>Dashboard</h1>
          <p>Welcome! Manage your student records here.</p>
        </div>

        <div className="cards">
          <div className="card">
            <p>Total Students</p>
            <h2>{students.length}</h2>
          </div>

          <div className="card">
            <p>Total Courses</p>
            <h2>{totalCourses}</h2>
          </div>
        </div>

        <div className="panel">
          <h2>Add New Student</h2>

          <form onSubmit={addStudent}>
            <label>Student Name</label>
            <input
              placeholder="Enter student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Course</label>
            <input
              placeholder="Enter course name"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "+ Add Student"}
            </button>
          </form>
        </div>

        <div className="panel">
          <h2>Student Records</h2>

          <input
            className="search"
            placeholder="Search student by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student._id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td>
                      <button
                        className="delete"
                        onClick={() => deleteStudent(student._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      No students found. Add your first student!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
