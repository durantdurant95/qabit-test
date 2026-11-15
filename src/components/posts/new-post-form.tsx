"use client";

import {
  useForm,
  useStore,
  type ValidationLogicFn,
} from "@tanstack/react-form";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { newPostSchema, type NewPostValues } from "@/lib/schemas";

const defaultValues: NewPostValues = { title: "", body: "" };

/**
 * Runs the `onDynamic` schema on every change, blur and submit. One validator
 * keeps a single error per field, so fixing a field clears its error right
 * away. The fields decide when to show it.
 */
const validateOnEveryEvent: ValidationLogicFn = ({
  event,
  form,
  runValidation,
  validators,
}) => {
  const runs = event.type !== "mount" && event.type !== "server";
  const fn = event.async ? validators?.onDynamicAsync : validators?.onDynamic;

  return runValidation({
    form,
    validators: runs ? [{ fn, cause: "dynamic" }] : [],
  });
};

type NewPostFormProps = {
  /** Resolves when the post is saved; the form resets afterwards. */
  onSubmit: (values: NewPostValues) => Promise<unknown>;
  /** The last submit error, shown above the actions. */
  error?: Error | null;
};

export function NewPostForm({ onSubmit, error }: NewPostFormProps) {
  const form = useForm({
    defaultValues,
    validationLogic: validateOnEveryEvent,
    validators: { onDynamic: newPostSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        // Parse again to send the trimmed values.
        await onSubmit(newPostSchema.parse(value));
        formApi.reset();
      } catch {
        // Keep the values so the user can retry; the error comes in as a prop.
      }
    },
  });

  const submissionAttempts = useStore(
    form.store,
    (state) => state.submissionAttempts,
  );

  return (
    <form
      noValidate
      aria-label="New post"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-5">
        <form.Field name="title">
          {(field) => {
            // Errors show once the field is left or a submit is attempted.
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isBlurred || submissionAttempts > 0);

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Give your post a title"
                  autoComplete="off"
                  aria-invalid={isInvalid}
                  aria-describedby={
                    isInvalid ? `${field.name}-error` : undefined
                  }
                />
                {isInvalid && (
                  <FieldError
                    id={`${field.name}-error`}
                    errors={field.state.meta.errors}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="body">
          {(field) => {
            // Errors show once the field is left or a submit is attempted.
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isBlurred || submissionAttempts > 0);

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Body</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="What do you want to say?"
                  rows={4}
                  aria-invalid={isInvalid}
                  aria-describedby={
                    isInvalid ? `${field.name}-error` : undefined
                  }
                />
                {isInvalid && (
                  <FieldError
                    id={`${field.name}-error`}
                    errors={field.state.meta.errors}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>

        {error && (
          <Alert variant="destructive" role="alert">
            <AlertCircleIcon />
            <AlertTitle>Couldn&apos;t publish the post</AlertTitle>
            <AlertDescription>
              Something went wrong while saving. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2Icon className="animate-spin" aria-hidden />
                )}
                {isSubmitting ? "Publishing…" : "Publish post"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
