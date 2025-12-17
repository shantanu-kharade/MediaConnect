import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { useToast, toast } from "../hooks/use-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const {register} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // logic to register the user goes here (
            await register(name, email, password);
            toast({
                title: "Account created!",
                description: "Welcome to media-connect.",
            });
            navigate("/feed");
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
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

                <div className="animate-fade-up" style={{ opacity: 0 }}>
                    <h1 className="font-display text-5xl font-bold leading-tight text-primary-foreground">
                        Start your
                        <span className="block bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                            journey today
                        </span>
                    </h1>
                    <p className="mt-6 max-w-md text-lg text-primary-foreground/70">
                        Create an account and become part of a community that celebrates
                        creativity and connection.
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

                    <div className="animate-fade-up stagger-1" style={{ opacity: 0 }}>
                        <h2 className="font-display text-3xl font-bold text-foreground">Create account</h2>
                        <p className="mt-2 text-muted-foreground">
                            Fill in your details to get started
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div className="animate-fade-up stagger-2 space-y-2" style={{ opacity: 0 }}>
                            <label className="text-sm font-medium text-foreground">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="animate-fade-up stagger-2 space-y-2" style={{ opacity: 0 }}>
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

                        <div className="animate-fade-up stagger-3 space-y-2" style={{ opacity: 0 }}>
                            <label className="text-sm font-medium text-foreground">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
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

                        <div className="animate-fade-up stagger-4 space-y-2" style={{ opacity: 0 }}>
                            <label className="text-sm font-medium text-foreground">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="animate-fade-up stagger-4" style={{ opacity: 0 }}>
                            <label className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 rounded border-border accent-gold"
                                    required
                                />
                                <span className="text-sm text-muted-foreground">
                                    I agree to the{" "}
                                    <a href="#" className="text-gold hover:underline">
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="text-gold hover:underline">
                                        Privacy Policy
                                    </a>
                                </span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="gold"
                            size="lg"
                            className=" cursor-pointer animate-fade-up stagger-5 w-full"
                            style={{ opacity: 0 }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating account..." : "Create account"}
                        </Button>
                    </form>

                    <div className="animate-fade-up mt-8 text-center" style={{ opacity: 0, animationDelay: "0.6s" }}>
                        <p className="text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/ " className="font-medium text-gold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
