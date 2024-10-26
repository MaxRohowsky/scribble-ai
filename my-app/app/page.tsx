'use client';

import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

type Inputs = {
  prompt: string,
};


export default function Home() {
  const [sketchId, setSketchId] = useState<Id<string> | null>(null); // Changed from "" to null

  const saveSketchMutation = useMutation(api.sketches.saveSketch);

  const sketchQuery = useQuery(api.sketches.getSketch, sketchId ? { sketchId } : "skip"); // Use "skip" instead of null

  console.log("sketchQuery", sketchQuery);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  const canvasRef = useRef<any>(null);


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">




      <form
        className="flex flex-col items-center justify-center gap-4"

        onSubmit={handleSubmit(async (formData) => {
          if (!canvasRef.current) return;
          const image = await canvasRef.current.exportImage("jpeg");

          console.log("image", image);

          const result = await saveSketchMutation({ ...formData, image });
          console.log(result);

        })}>
        <input className="w-full" {...register("prompt", { required: true })} />
        {errors.prompt && <span>This field is required</span>}


        <ReactSketchCanvas
          ref={canvasRef}
          style={{
            border: "1px solid #9c9c9c",
            borderRadius: "5px"
          }}
          width="500"
          height="500"
          strokeWidth={5}
          strokeColor="#000000"
        />

        {sketchQuery && <img src={sketchQuery.result} alt="sketch" />}


        <input className="bg-blue-500 text-white p-1 rounded-md w-full" type="submit" />
      </form>

    </main>
  )
}
