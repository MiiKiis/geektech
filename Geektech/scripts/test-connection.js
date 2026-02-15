const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

// 1. Manually load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('🔄 Checking .env.local at:', envPath);

if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file NOT FOUND!');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let value = match[2].trim();
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        envVars[match[1].trim()] = value;
    }
});

const connectionString = envVars.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL is NOT defined in .env.local');
    console.log('Found variables:', Object.keys(envVars));
    process.exit(1);
}

console.log('✅ DATABASE_URL found (starts with):', connectionString.substring(0, 15) + '...');

// 2. Test Connection
async function testConnection() {
    console.log('🔄 Attempting to connect to Neon...');
    try {
        const sql = neon(connectionString);
        const result = await sql`SELECT version()`;
        console.log('✅ Connection SUCCESSFUL!');
        console.log('📊 Database Version:', result[0].version);
    } catch (error) {
        console.error('❌ Connection FAILED:', error.message);
        if (error.code) console.error('Error Code:', error.code);
    }
}

testConnection();
