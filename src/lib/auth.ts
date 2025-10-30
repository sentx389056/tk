import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                login: {
                    label: "Логин",
                    type: "text",
                    placeholder: "Ваш логин"
                },
                password: {
                    label: "Пароль",
                    type: "password"
                }
            },
            async authorize(credentials) {
                if (!credentials?.login || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        login: credentials.login
                    },
                    include: {
                        member: true
                    }
                });

                if (!user) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    login: user.login,
                    name: user.member?.name || user.login
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.login = user.login;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as number,
                    login: token.login as string,
                    name: session.user?.name || token.login as string
                };
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/signin",
    }
};
