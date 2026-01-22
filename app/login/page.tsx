"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      if (data.user.role === "admin" || data.user.role === "superadmin") {
        router.push("/dashboard");
      } else {
        router.push("/"); // المستخدم العادي
      }
    } catch (err) {
      setError("حدث خطأ في تسجيل الدخول");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
      dir="rtl"
    >
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          onClick={handleLogin}
          className="bg-[#fdba00] w-full p-2 rounded-[26px] text-white"
        >
          تسجيل الدخول
        </button>
      </div>
    </div>
  );
}
