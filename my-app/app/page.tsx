'use client';

import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Inputs = {
  prompt: string,
};


export default function Home() {

  const saveSketchMutation = useMutation(api.sketches.saveSketch);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <form onSubmit={handleSubmit(async (formData) => {
        console.log(formData);
        const result = await saveSketchMutation({ prompt: formData.prompt });
        console.log(result);
      })}>
        <input {...register("prompt", { required: true })} />
        {errors.prompt && <span>This field is required</span>}

        <input type="submit" />
      </form>

    </main>
  )
}
