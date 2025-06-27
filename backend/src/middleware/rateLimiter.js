import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try{
        
        const {success} = await ratelimit.limit("my-rate-limit");
        if(!success) {
            return res.status(429).json({ error: "Too many requests, please try again later." });
        }

        next();
    }catch (err) {
        console.error("Error in rate limiter middleware:", err);
        return res.status(500).json({ error: "Internal Server Error" });
        next(err);
    }
}

export default rateLimiter;