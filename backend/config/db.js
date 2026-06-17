import mongoose from 'mongoose'
import dns from 'dns'

const connectDB = async () => {
    try {
        // Force Node.js to resolve IPv4 first and use standard DNS servers to resolve MongoDB Atlas SRV records
        dns.setDefaultResultOrder('ipv4first');
        try {
            dns.setServers(['8.8.8.8', '1.1.1.1']);
        } catch (dnsErr) {
            console.warn("Warning: Could not set custom DNS servers, proceeding with default resolver.", dnsErr.message);
        }
        
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default connectDB