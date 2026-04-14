"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { type SignInInput, type SignUpInput, signInSchema, signUpSchema } from "@/lib/validation/auth"

export async function signUpAction(data: SignUpInput) {
  const formData = signUpSchema.safeParse(data)

  if (!formData.success) {
    return {
      success: false,
      error: "Invalid input",
    }
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email: formData.data.email,
        password: formData.data.password,
        name: formData.data.name,
        username: formData.data.username,
      },
      headers: await headers(),
    })

    return {
      success: true,
      message: "Successfully signed up.",
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong.",
    }
  }
}

export async function signInAction(data: SignInInput) {
  const formData = signInSchema.safeParse(data)

  if (!formData.success) {
    return {
      success: false,
      error: "Invalid input",
    }
  }

  try {
    await auth.api.signInUsername({
      body: {
        username: formData.data.username,
        password: formData.data.password,
      },
      headers: await headers(),
    })

    return {
      success: true,
      message: "Successfully signed in.",
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong.",
    }
  }
}

export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    })

    return {
      success: true,
      message: "Successfully signed out.",
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong.",
    }
  }
}
