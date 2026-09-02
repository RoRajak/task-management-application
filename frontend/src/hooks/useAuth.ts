"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const response = await api.get("/api/check-session");
        if (!response.data || !response.data.valid) {
          localStorage.removeItem("token");
          localStorage.removeItem("name");
          router.push("/signin");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        router.push("/signin");
      }
    };

    checkSession();
  }, [router]);
};

export default useAuth;
