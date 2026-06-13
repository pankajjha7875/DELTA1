import mongoose from 'mongoose';

// Define the Message Schema
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Initialize the Model
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

// Database Connection helper
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is not defined");
    }
    return mongoose.connect(process.env.MONGODB_URI);
};

export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ success: false, message: "Method Not Allowed" });
        }

        await connectDB();
        
        const newMessage = await Message.create(req.body);
        return res.status(200).json({ success: true, data: newMessage });

    } catch (error) {
        console.error("Serverless Function Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}