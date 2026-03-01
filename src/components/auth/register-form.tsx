"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthControllerRegister } from "@/lib/services/authentication/authentication";
import { Loader2 } from "lucide-react";

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const registerMutation = useAuthControllerRegister({
    mutation: {
      onSuccess: () => {
        toast.success(t("registerSuccess"));
        onSuccess();
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({
      data: { email, password, displayName: displayName || undefined },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="register-name" className="text-sm font-medium">
          {t("displayName")}
        </label>
        <input
          id="register-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder={t("displayNamePlaceholder")}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="register-email" className="text-sm font-medium">
          {t("email")}
        </label>
        <input
          id="register-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder={t("emailPlaceholder")}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="register-password" className="text-sm font-medium">
          {t("password")}
        </label>
        <input
          id="register-password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder={t("passwordPlaceholder")}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {t("register")}
      </Button>
    </form>
  );
}
