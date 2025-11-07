import { prisma } from "@/libs/prismaDb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials) {
          return null;
        }
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
            include: {
              role: true
            }
          });
          if (!user) {
            return null;
          }
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!passwordMatch) {
            return null;
          }
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async (payload: any) => {
      const { token, trigger, session } = payload;
      const user = payload.user;
      if (trigger === "update") {
        // console.log(token.picture, session.user);
        return {
          ...token,
          ...session.user,
          picture: session.user.image,
          image: session.user.image,
        };
      }
      if (user) {
        return {
          ...token,
          uid: user.id,
          role: user.role,
          picture: user.image,
          image: user.image,
        };
      }
      return token;
    },

    session: async ({ session, token }) => {
      if (session?.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
            role: token.role,
            image: token.picture,
          },
        };
      }
      return session;
    },

    // async redirect({ url, baseUrl }) {
    //   console.log("REDIRECTION FUNCTION", url, baseUrl);
    // const parsedUrl = new URL(url, baseUrl);
    // if (parsedUrl.searchParams.has('callbackUrl')) {
    //   return `${baseUrl}${parsedUrl.searchParams.get('callbackUrl')}`;
    // }
    // if (parsedUrl.origin === baseUrl) {
    //   return url;
    // }
    //   return baseUrl;
    // },
  },
  // debug: process.env.NODE_ENV === "developement",
};

export const getAuthSession = async () => {
  return getServerSession(authOptions);
};
