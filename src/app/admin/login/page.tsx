import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";
import { AuthError } from "next-auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  async function handleLogin(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      // If successful, redirect manually
      redirect("/dashboard");
    } catch (error) {
      if (error instanceof AuthError) {
        // Handle specific auth errors
        switch (error.type) {
          case "CredentialsSignin":
            redirect("/admin/login?error=invalid");
          default:
            redirect("/admin/login?error=unknown");
        }
      }
      // This is the redirect from successful login
      throw error;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Container className="max-w-md">
        <div className="bg-white rounded-lg shadow-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600">Warung Enin</h1>
            <p className="text-gray-600 mt-2">Admin Dashboard</p>
          </div>

          {params.error === "invalid" && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              Email atau password salah
            </div>
          )}

          {params.error === "unknown" && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              Terjadi kesalahan. Silakan coba lagi.
            </div>
          )}

          <form action={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="admin@warungenin.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Login
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Demo: admin@warungenin.com / admin123
          </p>
        </div>
      </Container>
    </div>
  );
}
