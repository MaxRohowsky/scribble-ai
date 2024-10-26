'use client';

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Inputs = {
    prompt: string,
};


export default function Home() {

    const saveSketchMutation = useQuery(api.sketches.getSketches);




    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">

            {saveSketchMutation?.map((
                    sketch => <div key={sketch._id}>
                        <p>{sketch.prompt}</p>
                    </div>
                ))
            }



        </main>
    )
}
