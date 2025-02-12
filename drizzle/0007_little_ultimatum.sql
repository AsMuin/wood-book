ALTER TABLE "account" ADD CONSTRAINT "compoundKey" PRIMARY KEY("provider","providerAccountId");--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "compositePK" PRIMARY KEY("userId","credentialID");--> statement-breakpoint
ALTER TABLE "verificationToken" ADD CONSTRAINT "compoundKey" PRIMARY KEY("identifier","token");