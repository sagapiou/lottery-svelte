<script>
    //import ConnectButton from "./connectButton.svelte"
    
</script>

<svelte:head>
    <title>Smart Contract</title>
    <meta name="Dapp" content="Svelte app" />
</svelte:head>

<section>
    <!-- <ConnectButton /> -->

    Lottery Details : <br>
    <!-- <Wallet /> -->
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
    }

    h1 {
        width: 100%;
    }

    .welcome {
        position: relative;
        width: 100%;
        height: 0;
        padding: 0 0 calc(100% * 495 / 2048) 0;
    }

    .welcome img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        display: block;
    }
</style>
