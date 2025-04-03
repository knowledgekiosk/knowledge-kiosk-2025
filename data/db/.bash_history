mongo -u admin -p password123 --authenticationDatabase admin
mongo -u admink2025 -p admin360&01798 --authenticationDatabase admin
use knowledge-kiosk
db.createUser({
    user: "admink2025",
    pwd: "admin360&01798",
    roles: [{ role: "readWrite", db: "knowledge-kiosk" }]
});
exit
