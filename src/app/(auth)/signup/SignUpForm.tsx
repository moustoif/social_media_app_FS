/* /* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { signUpSchema, SignUpValues } from "@/lib/validation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/PasswordInput";
import LoadingButton from "@/components/LoadingButton";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { signUp } from "./actions";

export default function SignUpForm() {
    const [error, setError] = useState<string>();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast(); // Import du hook toast

    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
        },
        mode: "onBlur",
    });

    async function onSubmit(values: SignUpValues) {
        setError(undefined);
        startTransition(async () => {
            const { error } = await signUp(values);
            if (error) {
                setError(error); // Afficher l'erreur en cas de problème
            } else {
                // Afficher un toast en cas de succès
                toast({
                    title: "Account Created",
                    description: "Your account has been successfully created.",
                    variant: "default", // Assurez-vous que ce variant est défini dans votre système de toast
                });
            }
        });
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                {error && <p className="text-center text-destructive">{error}</p>}

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="p-1">
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <LoadingButton type="submit" className="w-full" loading={isPending}>
                    Create Account
                </LoadingButton>
            </form>
        </FormProvider>
    );
}


/* 
"use client";

import { signUpSchema, SignUpValues } from "@/lib/validation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Assurez-vous que le chemin est correct
import { PasswordInput } from "@/components/PasswordInput"; // Assurez-vous que le chemin est correct
import LoadingButton from "@/components/LoadingButton"; // Assurez-vous que le chemin est correct
import { useState, useTransition } from "react";
import { signUp } from "./actions";

export default function SignUpForm() {
    const [error, setError] = useState<string>(); // Gestion des erreurs globales
    const [isPending, startTransition] = useTransition(); // Transition pour le chargement

    // Initialiser le formulaire avec zod pour la validation
    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
        },
        mode:"onBlur",
    });

    // Gestion de la soumission du formulaire
    async function onSubmit(values: SignUpValues) {
        setError(undefined); // Réinitialiser les erreurs
        startTransition(async () => {
            const { error } = await signUp(values); // Appel de l'action de création d'utilisateur
            if (error) setError(error); // Si une erreur survient, l'afficher
        });
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                {error && <p className="text-center text-destructive">{error}</p>}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="p-1">
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <LoadingButton type="submit" className="w-full" loading={isPending}>
                    Create Account
                </LoadingButton>
            </form>
        </FormProvider>
    );
}


 */


/* "use client";

import { signUpSchema, SignUpValues } from "@/lib/validation";
import { Form, FormProvider, useForm } from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"; // Ou le bon chemin vers le composant Input
import { Button } from "@/components/ui/button"; // Ou le bon chemin vers le composant Input
import { useState, useTransition } from "react";
import { string } from "zod";
import { signUp } from "./actions";
import { PasswordInput } from "@/components/ui/passwordInput";
import LoadingButton from "@/components/LoadingButton";



export default function SignUpForm() {
    const [error, setError] = useState<string>();

    const [isPending, startTransition] = useTransition();

    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
        },
    });

    async function onSubmit(values: SignUpValues) {

        setError(undefined);
        startTransition(async () => {
            const {error} = await signUp(values);
            if (error) setError(error);
        })
        
    }
        const methods = useForm(); // Initialise le formulaire avec les méthodes
        const { register, handleSubmit, getFieldState } = useForm();

    return (
    <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField 
            {...error && <p className="text-center text-destructive">{error}</p>}
                control={form.control}
                name="username"
                render= {({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField 
                control={form.control}
                name="email"
                render= {({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Email" type="email" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField 
                control={form.control}
                name="password"
                render= {({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <PasswordInput placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <LoadingButton type="submit" className="w-full" loading={isPending}>
                Create Account
            </LoadingButton>
        </form>       
    </FormProvider>
);

} */ 