<script>
    export let transReceipt
    export let transError
</script>

{#if transReceipt !== null}
    <div>
        {#if transReceipt.status == 1}
            <h1>Transaction Success</h1>
        {:else}
            <h1>Transaction failed</h1>
        {/if}
        <h2>Address From: {transReceipt.from}</h2>
        <h2>Address To: {transReceipt.to}</h2>
        <h3>Transaction Block number: {transReceipt.blockNumber}</h3>
        <h3>Transaction index in block: {transReceipt.transactionIndex}</h3>
        <h3>Confirmations: {transReceipt.confirmations}</h3>
        <h3>Gas used: {transReceipt.gasUsed}</h3>
        <h3>Gas price: {transReceipt.effectiveGasPrice}</h3>
    </div>
{:else if transError !== null}
    <div>
        <h1>Transaction failed. Your transaction was never sent or rolled back!</h1>
        {#if transError.error.code !== null}
            <h2>Error Code: {transError.error.code}</h2>
            <h2>Error Message: {transError.error.message}</h2>
        {:else}
            <h2>Error: {transError.error}</h2>
        {/if}
    </div>
{/if}
