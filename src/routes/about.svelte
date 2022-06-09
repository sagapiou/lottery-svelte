<script context="module">
    import { browser, dev } from "$app/env"

    // we don't need any JS on this page, though we'll load
    // it in dev so that we get hot module replacement...
    export const hydrate = dev

    // ...but if the client-side router is already loaded
    // (i.e. we came here from elsewhere in the app), use it
    export const router = browser

    // since there's no dynamic data here, we can prerender
    // it so that it gets served as a static asset in prod
    export const prerender = true
</script>

<svelte:head>
    <title>About</title>
    <meta name="description" content="About this app" />
</svelte:head>

<div class="content">
    <h1>About this app</h1>

    <p>
        This is a decentralised application that is hosted on ipfs with no backend. It contains a
        connection process for connecting to metmask through ethers and communicates with a Lottery
        contract that uses chainlink for 2 purposes. Purpose number one is to receive a random
        number. Purpose 2 is for using chainlink keepers as a trigger for triggering a function in
        the contract to run. Hardhat-deploy has been used for deployments. It currently only works
        on the rinkeby testnet as it is the only ethereum tetnet that supports both the keepers and
        the vrf contracts of chainlink! For this Dapp to work, hardhat with hardhat-deploy was used
        and the steps taken for this to work were : 1. https://vrf.chain.link/ Get Subscription ID
        for chainlink VRF and fund it with some link 2. Deploy our contract using above subscription
        ID 3. Register the contract with Chainlink VRF and using the above subscription ID (ADD
        CONSUMER using the lottery contract address) 4. Register the contract to chainlink keepers
        (https://keepers.chain.link/ register new upkeep) 5. Run the staging test!
    </p>

    <pre>Enjoy!!!</pre>
</div>

<style>
    .content {
        width: 100%;
        max-width: var(--column-width);
        margin: var(--column-margin-top) auto 0 auto;
    }
</style>
