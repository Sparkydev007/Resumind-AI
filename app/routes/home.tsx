import type { Route } from "./+types/home";
import Navbar from "../../Components/Navbar";
import ResumeCard from "../../Components/ResumeCard";
import { resumes } from "../../constants";
import { useEffect } from "react";
import { usePuterStore } from "../lib/puter";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {

  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.isAuthenticated) {
      navigate("/auth");
    }
  }, [auth?.isAuthenticated, navigate]);

  useEffect(() => {
    window.puter?.ai?.chat("Hello");
  }, []);

  // ✅ BLOCK RENDER (FINAL FIX)
  if (!auth?.isAuthenticated) {
    return null;
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading">
          <h1>Track Your Applications & Resume Ratings</h1>
          <h2>Review your submissions and check AI-powered feedback.</h2>
        </div>
      </section>

      <section className="resume-list">
        {resumes.length > 0 ? (
          resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))
        ) : (
          <div className="empty-state">
            <p>No resumes available yet.</p>
          </div>
        )}
      </section>
    </main>
  );
}