import {z} from "zod";

const requiredString = z.string().trim().min(1, "Field required")
export const signUpSchema = z.object({
    email: requiredString.email("Invalid email address"),
    username: requiredString.regex(
        /^[a-zA-Z0-9_-]+$/,
        "Only letters, numbers, - and _ allowed"
    ),

    password: requiredString.regex(
        /^[a-zA-Z0-9-#]+$/,
        "Only letters, numbers, # allowed"
    ).min(8, "Must be at least 8 characters ")
})

export type SignUpValue = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
    username: requiredString,
    password: requiredString,
});

export type LoginValue = z.infer<typeof loginSchema>;