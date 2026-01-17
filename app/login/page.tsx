"use client";

export default function LoginPage() {
  const loginWithGoogle = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h1>
        <p className="mb-6 text-gray-600 text-center">
          الرجاء تسجيل الدخول للوصول إلى لوحة التحكم
        </p>
        <button
          className="bg-[#fdba00] cursor-pointer w-full p-2 rounded-[26px] text-white"
          onClick={loginWithGoogle}
        >
          تسجيل الدخول باستخدام Google
        </button>
      </div>
    </div>
  );
}
