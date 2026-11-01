import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import routes from './routes';
import { SocketService } from './services/socketService';
import { QueueService } from './services/queueService';
import { isLiveSupabaseConfigured } from './db/supabase';

const app = express();
const server = http.createServer(app);

// 1. Production Reverse Proxy Trust (Render, Vercel, Cloudflare, etc.)
app.set('trust proxy', 1);

// 2. Production Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Managed by Next.js on frontend
}));

// 3. Dynamic Production CORS Protection
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!config.isProduction || config.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin '${origin}' not permitted by ImpactLink CORS policy.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-demo-user']
}));

// 4. Rate Limiting for Authentication & Write Protection
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 min
  message: { success: false, message: 'Too many authentication attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
app.use('/api/v1/auth/forgot-password', authLimiter);

// 5. Body Parsers with payload limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Comprehensive Health & Readiness Endpoints for Cloud Probes
const startTime = Date.now();

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ImpactLink Express API Gateway',
    environment: config.nodeEnv,
    uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/ready', (req: Request, res: Response) => {
  const supabaseConnected = isLiveSupabaseConfigured();
  res.status(200).json({
    status: 'ready',
    database: supabaseConnected ? 'supabase-live' : 'in-process-store',
    redis: config.redis.isTls ? 'hosted-tls' : 'local-resilient',
    gemini_ai: config.geminiApiKey ? 'active' : 'unconfigured',
    timestamp: new Date().toISOString()
  });
});

// 7. API Routes
app.use('/api/v1', routes);

// 8. Global Error Handler (Sanitizes stack traces in production)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Unhandled Error]', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(config.isProduction ? {} : { stack: err.stack })
  });
});

// 9. Initialize Realtime Sockets & Background Queues
SocketService.init(server);
QueueService.init();

// 10. Start Server
if (process.env.NODE_ENV !== 'test') {
  server.listen(config.port, () => {
    console.log(`=======================================================`);
    console.log(`🚀 ImpactLink Backend running in ${config.nodeEnv.toUpperCase()} mode on port ${config.port}`);
    console.log(`🔒 Allowed Origins: ${config.allowedOrigins.join(', ') || 'All (Development)'}`);
    console.log(`⚡ Supabase: ${isLiveSupabaseConfigured() ? 'Live Connected' : 'Local Fallback'}`);
    console.log(`=======================================================`);
  });
}

// 11. Process Stability & Unhandled Error Protection
process.on('unhandledRejection', (reason: any) => {
  console.warn('[Process] Safely intercepted unhandledRejection:', reason?.message || reason);
});
process.on('uncaughtException', (err: any) => {
  console.error('[Process] Safely intercepted uncaughtException:', err?.message || err);
});

// 12. Graceful Shutdown on SIGTERM / SIGINT
const handleShutdown = (signal: string) => {
  console.log(`\n[Server] Received ${signal}. Gracefully closing HTTP and Socket connections...`);
  server.close(() => {
    console.log('[Server] Connections closed. Exiting process safely.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export { app, server };
