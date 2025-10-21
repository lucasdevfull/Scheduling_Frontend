import { useMutation } from "@tanstack/react-query";
import { Register } from "../types/register.types";
import { http } from "../utils/http";

export function useRegister() {
    return useMutation({
        mutationKey: ['register'],
        mutationFn: async (body: Register) => {
            const response = http
        }
    })
}