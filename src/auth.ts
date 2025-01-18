import db from '@/db';
import NextAuth, { CredentialsSignin, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials: { email?: string; password?: string }) {
                try {
                    if (!credentials.email || !credentials.password) {
                        throw new Error('请输入邮箱和密码');
                    }

                    const user = await db.query.user.findFirst({
                        where: (user, { eq }) => eq(user.email, credentials.email || '')
                    });

                    if (!user) {
                        throw new Error('用户不存在');
                    }

                    const isPasswordValid = await compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error('密码不正确');
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.fullName
                    } as User;
                } catch (error) {
                    throw new CredentialsSignin(error instanceof Error ? error.message : '登录失败');
                }
            }
        })
    ],
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }

            return session;
        }
    }
});
