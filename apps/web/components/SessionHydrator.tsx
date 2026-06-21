"use client";

import { useEffect } from "react";
import { useStore } from "../store/useStore";

const roleEmail = {
  patient: "patient@demo.com",
  hospital: "hospital@demo.com",
  pharmacy: "pharmacy@demo.com",
  insurance: "insurance@demo.com",
} as const;

export function SessionHydrator() {
  const user = useStore((state) => state.user);
  const login = useStore((state) => state.login);

  useEffect(() => {
    if (user || typeof document === "undefined") return;

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("healthmesh_token="))
      ?.split("=")[1] as keyof typeof roleEmail | undefined;

    if (token && token in roleEmail) {
      login(roleEmail[token]);
    }
  }, [login, user]);

  return null;
}
