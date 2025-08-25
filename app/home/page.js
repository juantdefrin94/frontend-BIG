"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!localStorage.getItem("token")) {
          router.push("/");
          return;
        }

        const res = await fetch("http://127.0.0.1:3000/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.status === 401) {
          router.push("/");
          return;
        }

        const data = await res.json();
        setUsers(data.users || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  // Placeholder functions
  const handleAddUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add User',
      html: `
        <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start; width: 100%;">
          <div style="display: flex; flex-direction: column; width: 100%;">
            <label for="swal-firstname" style="font-weight: 500;">Firstname</label>
            <input style="margin: 0;" id="swal-firstname" class="swal2-input" placeholder="Enter first name" value="" style="width: 100%;">
          </div>
          <br>
          <div style="display: flex; flex-direction: column; width: 100%;">
            <label for="swal-lastname" style="font-weight: 500;">Lastname</label>
            <input style="margin: 0;" id="swal-lastname" class="swal2-input" placeholder="Enter last name" value="" style="width: 100%;">
          </div>
          <br>
          <div style="display: flex; flex-direction: column; width: 100%;">
            <label for="swal-username" style="font-weight: 500;">Email</label>
            <input style="margin: 0;" id="swal-username" class="swal2-input" placeholder="Enter email" value="" style="width: 100%;">
          </div>
          <br>
          <div style="display: flex; flex-direction: column; width: 100%;">
            <label for="swal-password" style="font-weight: 500;">Password</label>
            <input style="margin: 0;" id="swal-password" type="password" class="swal2-input" placeholder="Enter new password" value="" style="width: 100%;">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        return {
          firstname: document.getElementById('swal-firstname').value,
          lastname: document.getElementById('swal-lastname').value,
          username: document.getElementById('swal-username').value,
          password: document.getElementById('swal-password').value,
        };
      }
    });

    if (!formValues) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch("http://127.0.0.1:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formValues }),
      });

      if (!res.ok) throw new Error("Failed to add user");

      Swal.fire("Created!", "User has been added.", "success");
      
      // Refresh user list

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to add user", "error");
    }
  }
  const handleEdit = async (user) => {
    let userData = users.find(u => u.username === user);
    if (!userData) return;

    const { value: formValues } = await Swal.fire({
      title: 'Edit User',
      html: `
        <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start; width: 100%;">
          <div style="display: flex; flex-direction: column; width: 100%;">
            <label for="swal-firstname" style="font-weight: 500;">Firstname</label>
            <input style="margin: 0;" id="swal-firstname" class="swal2-input" placeholder="Enter first name" value="${userData.firstname}" style="width: 100%;">
          </div>
          <br>
          <div style="display: flex; flex-direction: column; width: 100%;">
            <label for="swal-lastname" style="font-weight: 500;">Lastname</label>
            <input style="margin: 0;" id="swal-lastname" class="swal2-input" placeholder="Enter last name" value="${userData.lastname}" style="width: 100%;">
          </div>
          <br>
          <div style="display: flex; flex-direction: column; width: 100%;">
            <label for="swal-username" style="font-weight: 500;">Email</label>
            <input style="margin: 0;" id="swal-username" class="swal2-input" placeholder="Enter email" value="${userData.username}" style="width: 100%;">
          </div>
          <br>
          <div style="display: flex; flex-direction: column; width: 100%;">
            <label for="swal-password" style="font-weight: 500;">Password</label>
            <input style="margin: 0;" id="swal-password" type="password" class="swal2-input" placeholder="Enter new password" value="" style="width: 100%;">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        return {
          firstname: document.getElementById('swal-firstname').value,
          lastname: document.getElementById('swal-lastname').value,
          username: document.getElementById('swal-username').value,
          password: document.getElementById('swal-password').value,
          updatedUser: user
        };
      }
    });

    if (!formValues) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch("http://127.0.0.1:3000/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userData.id, ...formValues }),
      });

      if (!res.ok) throw new Error("Failed to update user");

      setUsers(users.map(u => u.id === userData.id ? { ...u, ...formValues } : u));

      Swal.fire("Updated!", "User has been updated.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update user", "error");
    }
  };

  // DELETE USER
  const handleDelete = async (user) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete user: ${user}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:3000/api/users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username: user }),
      });

      if (!res.status == 200) throw new Error("Failed to delete user");

      // Remove from local state
      setUsers(users.filter(u => u.id !== user.id));

      Swal.fire("Deleted!", "User has been deleted.", "success");
      router.push("/home");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete user", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) return <p style={styles.loading}>Loading...</p>;

  const dataUser = JSON.parse(localStorage.getItem("user"));

  // Filtered + paginated users
  const filteredUsers = users.filter(
    u =>
      u.firstname.toLowerCase().includes(search.toLowerCase()) ||
      u.lastname.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}><b>CRUD Operations</b></h2>
        <ul style={styles.sidebarList}>
          <li style={styles.sidebarItemImage}>
            <img style={styles.roundedImage} src="/assets/img/profile.jpg" />
            <h3><b>{dataUser.firstname} {dataUser.lastname}</b></h3>
            <p>Admin</p>
          </li>
          <li style={styles.sidebarItem} onClick={handleLogout}>
            <i className="fas fa-home" style={{ marginRight: "8px" }}></i> Home
          </li>
          <li style={styles.sidebarItem} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt" style={{ marginRight: "8px" }}></i> Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>User List</h1>
          <button style={styles.addButton} onClick={handleAddUser}>
            <i className="fas fa-user-plus" style={{ marginRight: "6px" }}></i> Add User
          </button>
        </div>

        <input
          type="text"
          placeholder="Search users..."
          style={styles.searchInput}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Password</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.td}>{user.firstname} {user.lastname}</td>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>{user.password}</td>
                  <td style={styles.td}>
                    <button style={styles.iconButton} onClick={() => handleEdit(user.username)} title="Edit">
                      <i className="fas fa-pencil"></i>
                    </button>
                    <button style={{ ...styles.iconButton, backgroundColor: "#d33" }} onClick={() => handleDelete(user.username)} title="Delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td style={styles.td} colSpan={4}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={styles.pagination}>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
            <span> Page {page} of {totalPages} </span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "row", minHeight: "100vh", fontFamily: "Arial, sans-serif", background: "#f5f7fa", flexWrap: "wrap" },
  sidebar: { width: "220px", minWidth: "220px", background: "#F2EAE1", color: "#fff", padding: "20px", flexShrink: 0 },
  container: { flex: 1, padding: "20px 40px", minWidth: "300px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" },
  addButton: { padding: "8px 16px", borderRadius: "6px", border: "none", backgroundColor: "#6358DC", color: "#fff", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", whiteSpace: "nowrap" },
  searchInput: { marginBottom: "10px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", width: "100%", maxWidth: "300px" },
  tableContainer: { overflowX: "auto", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  table: { width: "100%", minWidth: "500px", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px", background: "#333", color: "#fff", position: "sticky", top: 0 },
  tr: { borderBottom: "1px solid #eee", transition: "0.2s", cursor: "default" },
  trHover: { backgroundColor: "#f0f0f0" },
  td: { padding: "12px" },
  iconButton: { padding: "6px 10px", marginRight: "8px", borderRadius: "6px", border: "none", backgroundColor: "#6358DC", color: "#fff", cursor: "pointer", fontSize: "14px", display: "inline-flex", alignItems: "center", justifyContent: "center" },
  roundedImage: { width: "75%", height: "75%", borderRadius: "50%", objectFit: "cover" },
  loading: { textAlign: "center", marginTop: "100px", fontSize: "18px" },
  sidebarTitle: { marginBottom: "20px", fontSize: "20px", color: "black" },
  sidebarList: { listStyle: "none", padding: 0 },
  sidebarItem: { padding: "10px 0", cursor: "pointer", transition: "0.2s", display: "flex", alignItems: "center", fontSize: "16px", color: "black" },
  sidebarItemImage: { color: "black", padding: "10px 0", cursor: "pointer", transition: "0.2s", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" },
  title: { fontSize: "28px", color: "#333" },
  pagination: { marginTop: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },
};