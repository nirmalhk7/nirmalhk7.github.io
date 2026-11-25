// Public project IDs. Keep in sync with content/projects.
export const projectIds: readonly string[] = ["CP", "HealthnFitness", "ML-Coursera", "MedicalVR", "TCP-ChatApp", "Web-Complexity-Analysis", "atskit", "authfather", "autogen_topics", "bellman-ford", "collegeGo", "crypto", "dotfiles", "farmer-Market", "firstaidman", "foss-js", "geth-testnet-box", "handwriting_recognizer", "iet-website", "k8-autoscaler", "khan", "mean-crud", "mifos", "nirmalhk7", "nirmalhk7.github.io", "nirmalhk7website", "obscuring_blockchain", "scholarhub", "shell", "vehicle_reid", "veronica-cli", "yaccellent"];
// Next injects public blog filenames at config load; no filesystem code reaches clients.
export const blogIds: readonly string[] = JSON.parse(process.env.NEXT_PUBLIC_BLOG_IDS || '[]');
