import db from '@/db';
import NextAuth, { User } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import Resend from 'next-auth/providers/resend'
import { compare } from 'bcryptjs';
import { loginSchema } from './validations';

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: 'jwt',
        updateAge: 60 * 60 * 3,
        maxAge: 60 * 60 * 24
    },
    jwt: {
        maxAge: 60 * 60 * 24
    },
    providers: [
        credentials({
            credentials: {
                email: { label: '邮箱', type: 'email' },
                password: { label: '密码', type: 'password' }
            },
            async authorize(credentials) {
                try {
                    const { email, password } = loginSchema.parse(credentials);
                    const user = await db.query.users.findFirst({
                        where: (users, { eq }) => eq(users.email, email)
                    });

                    if (!user) {
                        throw new Error('用户不存在');
                    }

                    const isPasswordValid = await compare(password, user.password);

                    if (!isPasswordValid) {
                        throw new Error('无效的验证信息');
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.fullName
                    } as User;
                } catch (error) {
                    console.error(error);

                    return null;
                }
            }
        }),
        Resend
    ],
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
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
