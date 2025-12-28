import { useToast} from "../hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input.jsx";
import { Button } from "../components/ui/button.jsx";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { toast } = useToast();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate API call
            await login(email, password);
            toast({
                title: "Welcome back!",
                description: "You've successfully logged in.",
            });
            navigate("/feed");
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Invalid credentials. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen  text-white ">
            {/* Left Panel - Branding */}
            <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal p-12 lg:flex">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-light">
                            <span className="font-display text-2xl font-bold text-accent-foreground">M</span>
                        </div>
                        <span className="font-display text-2xl font-bold text-primary-foreground">
                            media-connect
                        </span>
                    </div>
                </div>

                <div className="animate-fade-up" >
                    <h1 className="font-display text-5xl font-bold leading-tight text-primary-foreground">
                        Connect with the
                        <span className="block bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                            world around you
                        </span>
                    </h1>
                    <p className="mt-6 max-w-md text-lg text-primary-foreground/70">
                        Join millions of people sharing moments, ideas, and stories that matter.
                    </p>
                </div>

                <p className="text-sm text-primary-foreground/50">
                    © 2025 media-connect. All rights reserved.
                </p>
            </div>

            {/* Right Panel - Form */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
                <div className="mx-auto w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold-light">
                            <span className="font-display text-xl font-bold text-accent-foreground">M</span>
                        </div>
                        <span className="font-display text-xl font-bold text-foreground">media-connect</span>
                    </div>

                    <div className="animate-fade-up stagger-1 "  >
                        <h2 className="font-display text-3xl font-bold text-foreground">Welcome back</h2>
                        <p className="mt-2 text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5"  >
                        <div className="animate-fade-up stagger-2 space-y-2">
                            <label className="text-sm font-medium text-foreground">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="animate-fade-up stagger-3 space-y-2"  >
                            <label className="text-sm font-medium text-foreground">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="animate-fade-up stagger-4 flex items-center justify-between"  >
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-border accent-gold"
                                />
                                <span className="text-sm text-muted-foreground">Remember me</span>
                            </label>
                            {/* <a href="#" className="text-sm font-medium text-gold hover:underline">
                                Forgot password?
                            </a> */}
                        </div>

                        <Button
                            type="submit"
                            variant="gold"
                            size="lg"
                            className="animate-fade-up stagger-5 w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>

                    <div className="animate-fade-up mt-8 text-center">
                        <p className="text-muted-foreground">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-medium text-gold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login