import React, { useState } from "react";
import { api } from "../utils/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    // Validation simple
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", text: "Tous les champs sont requis" });
      setIsSubmitting(false);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setStatus({ type: "error", text: "Format d'email invalide" });
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post("/api/contact", form);
      setStatus({ type: "success", text: "Message envoyé avec succès !" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", text: err.message || "Erreur lors de l'envoi" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact" style={{ padding: "3rem 1rem", textAlign: "center" }}>
      <h1>Contactez-nous</h1>
      <p>Pour toute question ou inscription, utilisez le formulaire ci-dessous.</p>

      <form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: "1.5rem auto", textAlign: "left" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem" }}>Nom *</label>
          <input 
            id="name" 
            name="name" 
            type="text"
            value={form.name} 
            onChange={handleChange} 
            placeholder="Votre nom"
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>Email *</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            placeholder="votre@exemple.com"
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="message" style={{ display: "block", marginBottom: "0.5rem" }}>Message *</label>
          <textarea 
            id="message" 
            name="message" 
            value={form.message} 
            onChange={handleChange} 
            placeholder="Votre message..."
            required
            rows="5"
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
          />
        </div>

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
          <button 
            type="submit" 
            className="btn btn-contact"
            disabled={isSubmitting}
            style={{ 
              padding: "0.75rem 1.5rem", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? "Envoi..." : "Envoyer"}
          </button>
          <button 
            type="button" 
            className="btn btn-info" 
            onClick={() => {
              setForm({ name: "", email: "", message: "" });
              setStatus(null);
            }}
            disabled={isSubmitting}
            style={{ 
              padding: "0.75rem 1.5rem", 
              backgroundColor: "#6c757d", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            Réinitialiser
          </button>
        </div>

        {status && (
          <div style={{ 
            marginTop: "1rem", 
            padding: "0.75rem", 
            borderRadius: "4px",
            backgroundColor: status.type === "error" ? "#f8d7da" : "#d1e7dd",
            color: status.type === "error" ? "#721c24" : "#0f5132",
            border: `1px solid ${status.type === "error" ? "#f5c6cb" : "#badbcc"}`
          }}>
            {status.text}
          </div>
        )}
      </form>
    </section>
  );
}