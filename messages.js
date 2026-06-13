import mongoose from 'mongoose';

const Message = mongoose.models.Message || mongoose.model('Message', new mongoose.Schema({
    name: String, email: String, message: String, createdAt: Date
}));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    return mongoose.connect(process.env.MONGODB_URI);
};

export default async function handler(req, res) {
    const { method, headers } = req;
    const adminPassword = headers['x-admin-password'];

    // Basic Security Check
    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: "Unauthorized access denied." });
    }

    try {
        await connectDB();
        
        if (method === 'GET') {
            const messages = await Message.find().sort({ createdAt: -1 });
            return res.status(200).json(messages);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Database Error: " + error.message });
    }
}