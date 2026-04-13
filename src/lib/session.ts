export function getSessionId() {
	if (typeof window === "undefined") return "";

	let sessionId = localStorage.getItem("devroaster_session_id");
	if (!sessionId) {
		sessionId = crypto.randomUUID();
		localStorage.setItem("devroaster_session_id", sessionId);
	}
	return sessionId;
}
