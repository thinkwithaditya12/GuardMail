# **AI-Powered Email Threat Detection, GeoLocation and Forensic Intelligence Platform**

Phishing and email spoofing aren't just technical glitches; they are orchestrated breaches of trust that account for the vast majority of corporate cyber incidents. Most forensic tools require manual header parsing, which creates friction. Valuing clear, focused signal over noisy data, we stripped away the clutter to build a forensic tool that cuts straight to the truth of an email's intent. This platform analyzes an uploaded `.eml` file and visually deconstructs its threat level in under three seconds.

**Core Modules**

* **AI Threat Detection:** Analyzes the email body text, suspicious URLs, and attachment metadata. It utilizes a pre-trained API wrapper (like Gemini 1.5 Flash or HuggingFace) combined with standard regex to instantly output a Threat Score (0–100%), classification (e.g., Phishing, Spoofing), and red-flagged keywords via structured JSON.


* **GeoLocation Tracking:** Parses raw email headers to extract `Received:` IP addresses and dynamically renders the sender's hop path on an interactive map using Leaflet.js or Mapbox.


* **Forensic Intelligence Dashboard:** Automatically validates authentication protocols including SPF, DKIM, and DMARC. It displays header breakdowns with high-contrast visual indicators (Red for Malicious, Yellow for Suspicious, Green for Safe) and exports a complete incident report as a downloadable PDF.



**Architecture & Tech Stack**

* **Frontend:** React/Next.js interface designed for immediate clarity, featuring a simple file drag-and-drop zone.


* **Backend:** Python endpoint using FastAPI or Flask to handle fast rule checks (like blacklisted IPs or SPF failures) and parse `.eml` files.


* **AI Engine:** Rapid API integration designed to analyze human intent and urgency in the text, merging with backend checks to produce a unified threat metric.



**Local Deployment**

This project was forged pragmatically for the intense 36-hour crucible of the Smart India Hackathon. It is built to deploy fast and fail gracefully.

1. Clone the repository and install the required dependencies.
2. Add your respective API keys (for Gemini/HuggingFace and the chosen IP Geolocation service) to your `.env` file.


3. Run the backend endpoint via FastAPI or Flask.


4. Boot the frontend, drag a sample `.eml` file into the UI, and view the live extraction and threat scoring.
