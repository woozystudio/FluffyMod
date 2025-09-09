export function generateReportId(): string {
	const chars = "abcdef0123456789";
	let id = "";

	for (let i = 0; i < 6; i++) {
		const randomIndex = Math.floor(Math.random() * chars.length);
		id += chars[randomIndex];
	}

	return id;
}
