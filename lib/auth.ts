import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Allow "admin" as a shorthand username for the admin account
        let lookupEmail = credentials.email.toLowerCase();
        if (lookupEmail === "admin") {
          lookupEmail = process.env.ADMIN_EMAIL?.toLowerCase() ?? lookupEmail;
        }

        const user = await prisma.user.findUnique({
          where: { email: lookupEmail },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "PATIENT";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

export const getSession = () => getServerSession(authOptions);
export const requireAuth = async () => {
  const session = await getSession();
  if (!session) return null;
  return session;
};
export const requireAdmin = async () => {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
};
