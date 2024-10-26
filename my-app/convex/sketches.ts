import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import Replicate from "replicate";
import { Id } from "./_generated/dataModel";

export const saveSketch = mutation(
    async ({ db, scheduler }, { prompt, image }: { prompt: string, image: string }) => {
        const sketch = await db.insert("sketches", {
            prompt: prompt,
            image: image,
            createdAt: Date.now()
        });

        console.log("sketch", sketch);

        await scheduler.runAfter(0, internal.sketches.generate, {
            sketchId: sketch,
            prompt: prompt,
            image: image
        });

        return sketch;
    }
);


export const generate = internalAction(
    async ({ runMutation }, { sketchId, prompt, image }: { sketchId: Id<string>; prompt: string; image: string }) => {

        const replicate = new Replicate();

        const input = {
            image,
            scale: 7,
            prompt,
            image_resolution: "512", // Changed to a valid value
            n_prompt: "lowres, text, cropped, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck"
        };


        const output = await replicate.run(
            "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
            { input }
        ) as string[];


        runMutation(internal.sketches.updateSketchResult, {
            sketchId,
            result: output[1],
        })

    }
)


export const updateSketchResult = internalMutation(
    async ({ db }, { sketchId, result }: { sketchId: Id<string>; result: string }) => {
        await db.patch(sketchId, {
            result: result
        })
    }
)

export const getSketches = query(
    async ({ db }) => {
        const sketches = await db.query('sketches').collect();
        return sketches
    }
)



export const getSketch = query(
    async ({ db }, { sketchId }: { sketchId: Id<string> }) => {
        const sketch = await db.get(sketchId);
        return sketch;
    }
)
