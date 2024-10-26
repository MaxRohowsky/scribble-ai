import { mutation, query } from "./_generated/server";

export const saveSketch = mutation(
    async ({ db }, { prompt }: { prompt: string }) => {
        await db.insert("sketches", {
            prompt: prompt,
            createdAt: Date.now()
        });

        return {
            message: "success"
        }
    }
);


export const getSketches = query(
    async ({ db }) => {
        const sketches = await db.query('sketches').collect();
        return sketches
    }
)