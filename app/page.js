"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AuthPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://127.0.0.1:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password }),
                credentials: "include",
            });

            const data = await res.json();
            if (data.status == 200) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.data));
                await Swal.fire({
                    icon: "success",
                    title: "Logged In!",
                    text: "Successfully logged in.",
                    timer: 1000,
                    showConfirmButton: false,
                    timerProgressBar: true, // optional, progress bar
                });
                router.push("/home");
            } else {
                alert(data.message);
            }
        } catch {
            alert("Server error!");
        }
    };

    const toRegister = () => {
        router.push("/register");
    };

    return (
        <div style={styles.container}>
        <div style={styles.leftContainer}>
            <img src="/assets/img/login.png" style={styles.img} />
        </div>
        <div style={styles.rightContainer}>
            <div style={styles.card}>
                <div style={styles.titleContainer}>
                    <h1 style={styles.title}>Welcome to</h1>
                    <p style={styles.subtitle}><b>BIGFORUM</b></p>
                </div>
                <form onSubmit={handleSubmit} style={styles.form}>

                    {/* Email Input */}
                    <div style={{ position: "relative", marginBottom: "20px" }}>
                    <i className="fas fa-envelope" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#888" }}></i>
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "12px 40px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }}
                    />
                    </div>

                    {/* Password Input */}
                    <div style={{ position: "relative", marginBottom: "20px" }}>
                    <i className="fas fa-lock" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#888" }}></i>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "12px 40px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }}
                    />
                    <i
                        className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                        style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#6358DC", cursor: "pointer" }}
                        onClick={() => setShowPassword(!showPassword)}
                    ></i>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <label style={{ fontSize: "14px", color: "#666" }}>
                        <input type="checkbox" style={{ marginRight: "8px" }} /> Remember Me
                        </label>
                        <a href="#" style={{ color: "#6358DC", fontSize: "14px", textDecoration: "none" }}>Forgot Password?</a>
                    </div>

                    <button type="submit" style={{ ...styles.button, backgroundColor: "#6358DC" }}>
                    Login
                    </button>
                </form>

                <p style={styles.toggleText}>
                    Don't have an account? 
                    <span style={{ ...styles.toggleLink, color: "#6358DC" }} onClick={() => toRegister()}>
                    {" Register"}
                    </span>
                </p>
            </div>
        </div>
        </div>
    );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#F4F4F4",
    fontFamily: "Arial, sans-serif",
  },
  img: {
    width: "75%"
  },
  leftContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundSize: "cover",
    borderTopLeftRadius: "10px",
    borderBottomLeftRadius: "10px",
    maxWidth: "50%",
    height: "100vh",
    padding: "10%"
  },
  rightContainer: {
    flex: 1,
    backgroundSize: "cover",
    borderTopLeftRadius: "10px",
    borderBottomLeftRadius: "10px",
    maxWidth: "50%",
    height: "100vh",
    padding: "10%"
  },
  titleContainer: {
    marginBottom: "30px",
    textAlign: "left"
  },
  card: {
    width: "100%",
    padding: "40px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  title: { fontSize: "18px", color: "#333"},
  subtitle: { fontSize: "24px", fontWeight: '900', color: "#6358DC", marginBottom: "30px" },
  form: { display: "flex", flexDirection: "column" },
  button: { 
    padding: "12px", 
    borderRadius: "6px", 
    border: "none", 
    color: "#fff", 
    fontSize: "16px", 
    cursor: "pointer", 
    transition: "0.3s",
    marginTop: "10px"
  },
  toggleText: { marginTop: "20px", fontSize: "12px", color: "#888" },
  toggleLink: { fontWeight: "bold", cursor: "pointer" },
};