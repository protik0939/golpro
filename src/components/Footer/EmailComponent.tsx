'use client'
import React, { useState } from "react";

export default function EmailComponent() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();

        try {
            const response = await fetch("/api/subscriberwithemail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            setMessage(data.message);
            if (response.ok) setEmail("");
            setLoading(false);
        } catch (error) {
            setMessage(`Something went wrong. Please try again:`);
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h6 className="footer-title">Newsletter</h6>
            <fieldset className="w-full flex flex-col">
                <label>Enter your email address</label>
                <div className="join @max-md:flex @max-md:flex-col">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="username@site.com"
                        className="input input-bordered join-item"
                        required
                    />
                    <button disabled={loading} className={`btn ${loading ? 'btn-disabled' : 'btn-primary'} join-item`}>{loading ? <span className="loading loading-infinity loading-md" /> : 'Subscribe'}</button>
                </div>
                {message && <p>{message}</p>}
            </fieldset>
        </form>
    );
}