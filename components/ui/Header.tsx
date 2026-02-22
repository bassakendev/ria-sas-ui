import { useAuth } from "@/lib/hooks/useAuth";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn, isLoading, logout } = useAuth();

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        router.push('/');
    };

    if (isLoading) {
        return <div className="min-h-screen bg-white dark:bg-gray-950" />;
    }

    return <nav className="sticky top-0 z-40 h-20 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="mx-auto flex h-full max-w-300 items-center justify-between px-5 sm:px-6">
            <div className="flex items-center gap-3">
                <Link href="/"><div className="text-3xl font-bold">RIA SaaS</div></Link>
                <span className="hidden text-base text-gray-400 sm:inline">Facturation simple et claire</span>
            </div>
            <div className="hidden items-center gap-8 sm:flex">
                <a className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" href="#features">Features</a>
                <a className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" href="/pricing">Pricing</a>
                <ThemeToggle />
                {isLoggedIn ? (
                    <>
                        <Link href="/dashboard">
                            <Button variant="secondary" className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
                                Dashboard
                            </Button>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 text-base font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            <Button variant="secondary" className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
                                Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="primary" className="bg-blue-600 px-6 py-3 hover:bg-blue-700">
                                Start Free
                            </Button>
                        </Link>
                    </>
                )}
            </div>
            <div className="flex items-center gap-3 sm:hidden">
                <ThemeToggle />
                <button
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>
        </div>
        {menuOpen && (
            <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 sm:hidden">
                <div className="mx-auto flex max-w-300 flex-col gap-4 px-5 py-5">
                    <a className="text-base font-medium text-gray-700 dark:text-gray-300" href="#features" onClick={() => setMenuOpen(false)}>Features</a>
                    <a className="text-base font-medium text-gray-700 dark:text-gray-300" href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                                <Button variant="secondary" className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    Dashboard
                                </Button>
                            </Link>
                            <Button
                                variant="secondary"
                                onClick={handleLogout}
                                className="w-full border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setMenuOpen(false)}>
                                <Button variant="secondary" className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register" onClick={() => setMenuOpen(false)}>
                                <Button variant="primary" className="w-full bg-blue-600 px-6 py-3 hover:bg-blue-700">
                                    Start Free
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        )}
    </nav>
}