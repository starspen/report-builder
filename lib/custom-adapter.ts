// customAdapter.ts
import type {
    Adapter,
    AdapterUser,
    AdapterAccount,
    AdapterSession,
    VerificationToken,
  } from "next-auth/adapters";
  import {prisma} from "./prisma"; // Your Prisma client instance
  import bcrypt from "bcrypt"
import { Prisma } from "@prisma/client";
  
  // Helper function to get the first element of an array or null.
  function firstOrNull<T>(arr: T[]): T | null {
    return arr && arr.length > 0 ? arr[0] : null;
  }
  
  export function CustomAdapter(): Adapter {
    return {
      // --- User Methods ---
  
      async createUser(user) {
        // Generate a unique id if one isn't provided.
        console.log("creating user")
        console.log(user)
        const id =
          user.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : new Date().getTime().toString());
        // if(user?.password !== undefined){
        //   const hashedPassword = await bcrypt.hash(user.password, 10);
        // }
        const hashedPassword = await bcrypt.hash('@Btid12345', 10)
        await prisma.$executeRaw(Prisma.sql`
          INSERT INTO mgr.users (id, email, name, pict, password, created_by, created_at)
          VALUES (${id}, ${user.email}, ${user.name}, ${user.image}, ${hashedPassword}, 
          'MGR', GETDATE());
        `)
        const result = await prisma.$queryRaw<AdapterUser[]>`
          SELECT TOP 1 * FROM mgr.users WHERE id = ${id}
        `;
        const userRecord = firstOrNull(result);
        if (!userRecord) {
          throw new Error("Failed to create user");
        }
        return userRecord;
      },
  
      async getUser(id) {
        const result = await prisma.$queryRaw<AdapterUser[]>`
          SELECT TOP 1 * FROM mgr.users WHERE id = ${id}
        `;
        return firstOrNull(result);
      },
  
      async getUserByEmail(email) {
        const result = await prisma.$queryRaw<AdapterUser[]>`
          SELECT TOP 1 * FROM mgr.users WHERE email = ${email}
        `;
        return firstOrNull(result);
      },
  
      async getUserByAccount({ provider, providerAccountId }) {
        const result = await prisma.$queryRaw<AdapterUser[]>`
          SELECT TOP 1 u.*
          FROM mgr.accounts a
          JOIN mgr.users u ON a.user_id = u.id
          WHERE a.provider = ${provider} AND a.provider_account_id = ${providerAccountId}
        `;
        return firstOrNull(result);
      },
  
      async updateUser(user) {
        await prisma.$executeRaw`
          UPDATE mgr.users
          SET email = ${user.email},
              name = ${user.name},
              pict = ${user.image}
          WHERE id = ${user.id}
        `;
        return user as AdapterUser;
      },
  
      async deleteUser(userId) {
        await prisma.$executeRaw`
          DELETE FROM mgr.users WHERE id = ${userId}
        `;
      },
  
      // --- Account Methods ---
  
      async linkAccount(account) {
        const id =
          account.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : new Date().getTime().toString());
        await prisma.$executeRaw`
          INSERT INTO mgr.accounts 
            (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, 
            token_type, scope, id_token, session_state,
            created_at, updated_at)
          VALUES (
            ${id},
            ${account.userId},
            ${account.type},
            ${account.provider},
            ${account.providerAccountId},
            ${account.refresh_token},
            ${account.access_token},
            ${account.expires_at},
            ${account.token_type},
            ${account.scope},
            ${account.id_token},
            ${account.session_state},
            GETDATE(),
            GETDATE()
          )
        `;
        return account as AdapterAccount;
      },
  
      async unlinkAccount({ provider, providerAccountId }) {
        await prisma.$executeRaw`
          DELETE FROM mgr.accounts
          WHERE provider = ${provider} AND provider_account_id = ${providerAccountId}
        `;
      },
  
      // --- Session Methods ---
  
      async createSession(session) {
        await prisma.$executeRaw`
          INSERT INTO mgr.sessions (session_token, user_id, expires)
          VALUES (${session.sessionToken}, ${session.userId}, ${session.expires})
        `;
        return session as AdapterSession;
      },
  
      async getSessionAndUser(sessionToken) {
        // Define a type for the joined record from mgr.sessions and mgr.users.
        type SessionUserRecord = {
          emailVerified: Date | null;
          sessionToken: string;
          expires: Date;
          userId: string;
          email: string;
          name: string;
          image: string;
        };
  
        const result = await prisma.$queryRaw<SessionUserRecord[]>`
          SELECT TOP 1 
            s.session_token, 
            s.expires, 
            u.id as userId, 
            u.email, 
            u.name, 
            u.pict
          FROM mgr.sessions s
          JOIN mgr.users u ON s.user_id = u.id
          WHERE CAST(s.session_token AS nvarchar(max)) = ${sessionToken}
        `;
        const record = firstOrNull(result);
        if (!record) return null;
  
        const session: AdapterSession = {
          sessionToken: record.sessionToken,
          userId: record.userId,
          expires: record.expires,
        };
        const user: AdapterUser = {
          id: record.userId,
          email: record.email,
          name: record.name,
          image: record.image,
          emailVerified: record.emailVerified,
          // password: record.password
        };
        return { session, user };
      },
  
      async updateSession(session) {
        await prisma.$executeRaw`
          UPDATE mgr.sessions
          SET expires = ${session.expires}
          WHERE session_token = ${session.sessionToken}
        `;
        return session as AdapterSession;
      },
  
      async deleteSession(sessionToken) {
        await prisma.$executeRaw`
          DELETE FROM mgr.sessions WHERE session_token = ${sessionToken}
        `;
      },
  
      // --- Verification Token Methods ---
  
      async createVerificationToken(verificationToken) {
        await prisma.$executeRaw`
          INSERT INTO mgr.verificationTokens (identifier, token, expires)
          VALUES (${verificationToken.identifier}, ${verificationToken.token}, ${verificationToken.expires})
        `;
        return verificationToken as VerificationToken;
      },
  
      async useVerificationToken({ identifier, token }) {
        const result = await prisma.$queryRaw<VerificationToken[]>`
          SELECT TOP 1 * FROM mgr.verificationTokens
          WHERE identifier = ${identifier} AND token = ${token}
        `;
        const vt = firstOrNull(result);
        if (!vt) return null;
        await prisma.$executeRaw`
          DELETE FROM mgr.verificationTokens
          WHERE identifier = ${identifier} AND token = ${token}
        `;
        return vt;
      },
    };
  }
  