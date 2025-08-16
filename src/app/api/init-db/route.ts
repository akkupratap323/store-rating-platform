import { NextResponse } from 'next/server';
import { pool } from '@/lib/database/connection';
import { hashPassword } from '@/lib/auth/password';

export async function POST() {
  try {
    console.log('Initializing database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 3 AND LENGTH(name) <= 60),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          address TEXT NOT NULL CHECK (LENGTH(address) <= 400),
          role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'store_owner')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create stores table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stores (
          id SERIAL PRIMARY KEY,
          name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 3 AND LENGTH(name) <= 60),
          email VARCHAR(255) UNIQUE NOT NULL,
          address TEXT NOT NULL CHECK (LENGTH(address) <= 400),
          owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create ratings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, store_id)
      );
    `);

    // Update name constraint to allow shorter names
    await pool.query(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_name_check;
      ALTER TABLE users ADD CONSTRAINT users_name_check CHECK (LENGTH(name) >= 3 AND LENGTH(name) <= 60);
      ALTER TABLE stores DROP CONSTRAINT IF EXISTS stores_name_check;
      ALTER TABLE stores ADD CONSTRAINT stores_name_check CHECK (LENGTH(name) >= 3 AND LENGTH(name) <= 60);
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id);
      CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
      CREATE INDEX IF NOT EXISTS idx_ratings_store_id ON ratings(store_id);
    `);

    // Create update trigger function
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create triggers
    await pool.query(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
              CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
                  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_stores_updated_at') THEN
              CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
                  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ratings_updated_at') THEN
              CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings
                  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
          END IF;
      END $$;
    `);

    // Create default admin user
    const adminPassword = await hashPassword('Admin123!');
    await pool.query(`
      INSERT INTO users (name, email, password, address, role) 
      VALUES (
          'System Administrator User', 
          'admin@storerating.com', 
          $1,
          '123 Admin Street, Admin City, AC 12345',
          'admin'
      ) ON CONFLICT (email) DO NOTHING;
    `, [adminPassword]);

    // Create sample store owner
    const storeOwnerPassword = await hashPassword('StoreOwner123!');
    await pool.query(`
      INSERT INTO users (name, email, password, address, role) 
      VALUES (
          'Store Owner Demo User Account', 
          'storeowner@demo.com', 
          $1,
          '456 Store Owner Street, Business District, BD 67890',
          'store_owner'
      ) ON CONFLICT (email) DO NOTHING;
    `, [storeOwnerPassword]);

    // Create sample normal user
    const normalUserPassword = await hashPassword('NormalUser123!');
    await pool.query(`
      INSERT INTO users (name, email, password, address, role) 
      VALUES (
          'Demo Normal User Account For Testing', 
          'user@demo.com', 
          $1,
          '789 Normal User Street, Residential Area, RA 13579',
          'user'
      ) ON CONFLICT (email) DO NOTHING;
    `, [normalUserPassword]);

    // Create sample stores
    const storeOwnerResult = await pool.query('SELECT id FROM users WHERE email = $1', ['storeowner@demo.com']);
    const storeOwnerId = storeOwnerResult.rows[0]?.id;

    if (storeOwnerId) {
      await pool.query(`
        INSERT INTO stores (name, email, address, owner_id) 
        VALUES 
        ('Demo Coffee Shop and Bakery Store', 'coffee@demo.com', '123 Coffee Street, Downtown Area, DA 12345', $1),
        ('Demo Electronics and Gadgets Store', 'electronics@demo.com', '456 Tech Avenue, Innovation District, ID 67890', $1),
        ('Demo Fashion and Clothing Boutique', 'fashion@demo.com', '789 Fashion Boulevard, Style District, SD 24680', $1)
        ON CONFLICT (email) DO NOTHING;
      `, [storeOwnerId]);
    }

    // Create sample stores without owners
    await pool.query(`
      INSERT INTO stores (name, email, address) 
      VALUES 
      ('Independent Grocery Store Chain', 'grocery@independent.com', '321 Grocery Lane, Shopping Center, SC 97531'),
      ('Local Hardware and Tools Store', 'hardware@local.com', '654 Tools Street, Industrial Area, IA 86420')
      ON CONFLICT (email) DO NOTHING;
    `);

    // Create sample ratings for testing Store Owner features
    const normalUserResult = await pool.query('SELECT id FROM users WHERE email = $1', ['user@demo.com']);
    const normalUserId = normalUserResult.rows[0]?.id;

    const storesResult = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [storeOwnerId]);
    const storeIds = storesResult.rows.map(row => row.id);

    if (normalUserId && storeIds.length > 0) {
      // Create ratings from the normal user to the store owner's stores
      for (const storeId of storeIds) {
        const rating = Math.floor(Math.random() * 3) + 3; // Random rating between 3-5
        await pool.query(`
          INSERT INTO ratings (user_id, store_id, rating) 
          VALUES ($1, $2, $3) 
          ON CONFLICT (user_id, store_id) DO NOTHING;
        `, [normalUserId, storeId, rating]);
      }
    }

    // Add more sample users to create more ratings
    const sampleUsersData = [
      { name: 'Alice Johnson Smith Customer', email: 'alice@customer.com', password: await hashPassword('Alice123!'), address: '100 Alice Street, Customer City, CC 11111' },
      { name: 'Bob Williams Davis Customer', email: 'bob@customer.com', password: await hashPassword('Bob123!'), address: '200 Bob Avenue, Customer Town, CT 22222' },
      { name: 'Charlie Brown Miller Customer', email: 'charlie@customer.com', password: await hashPassword('Charlie123!'), address: '300 Charlie Road, Customer Village, CV 33333' }
    ];

    for (const userData of sampleUsersData) {
      await pool.query(`
        INSERT INTO users (name, email, password, address, role) 
        VALUES ($1, $2, $3, $4, 'user') 
        ON CONFLICT (email) DO NOTHING;
      `, [userData.name, userData.email, userData.password, userData.address]);

      // Get the user ID and create ratings
      const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userData.email]);
      const userId = userResult.rows[0]?.id;

      if (userId && storeIds.length > 0) {
        // Each user rates 1-2 stores randomly
        const numRatings = Math.floor(Math.random() * 2) + 1;
        const shuffledStores = [...storeIds].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < numRatings && i < shuffledStores.length; i++) {
          const rating = Math.floor(Math.random() * 5) + 1; // Random rating 1-5
          await pool.query(`
            INSERT INTO ratings (user_id, store_id, rating) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (user_id, store_id) DO NOTHING;
          `, [userId, shuffledStores[i], rating]);
        }
      }
    }

    return NextResponse.json({
      message: 'Database initialized successfully!',
      defaultAccounts: {
        admin: { email: 'admin@storerating.com', password: 'Admin123!' },
        storeOwner: { email: 'storeowner@demo.com', password: 'StoreOwner123!' },
        user: { email: 'user@demo.com', password: 'NormalUser123!' }
      }
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { message: 'Database initialization failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}