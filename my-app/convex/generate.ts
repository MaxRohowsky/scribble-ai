"use node";

import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import Replicate from "replicate";

export const generate = internalAction({
    args: { sketchId: v.id("sketches"), prompt: v.string(), image: v.string() },
    handler: async (ctx, { prompt, image, sketchId }) => {
        if (!process.env.REPLICATE_API_TOKEN) {
            throw new Error(
                "Add REPLICATE_API_TOKEN to your environment variables: " +
                "https://docs.convex.dev/production/environment-variables"
            );
        }
        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });

        try {
            const output = (await replicate.predictions.create({
                version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
                input: {
                    image,
                    scale: 7,
                    prompt,
                    image_resolution: "512",
                    n_prompt:
                        "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
                },
            })) as any;

            const predictionId = output.id;

            // Polling for the prediction result
            let predictionResult;
            do {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
                predictionResult = await replicate.predictions.get(predictionId);

                // Check for failed status
                if (predictionResult.status === 'failed') {
                    throw new Error(`Prediction failed: ${predictionResult.error}`);
                }
            } while (predictionResult.status !== 'succeeded');

            // Accessing the output URL for output_1.png
            const result = predictionResult.output; // Destructure output
            const output1Url = result[1]; // Get the second output URL (output_1.png)

            console.log("output1Url", output1Url);

            await ctx.runMutation(internal.sketches.updateSketchResult, {
                sketchId,
                result: output1Url,
            });

        } catch (error) {
            console.error("Full error details:", error); // Log the full error object for more context
        }

        /*         const output = (await replicate.predictions.create({
                    version:"435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
                    input: {
                        image,
                        scale: 7,
                        prompt,
                        image_resolution: "512",
                        n_prompt:
                            "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
                    },
        
                })) as any;
        
              const result = output;
        
                console.log("output", result); */


    },
});