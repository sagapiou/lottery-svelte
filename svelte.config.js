//import adapter from "@sveltejs/adapter-auto"
import adapter_static from "@sveltejs/adapter-static"
import preprocess from "svelte-preprocess"

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter_static(),
    },

    preprocess: preprocess(),
}

export default config
