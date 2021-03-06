<script>
    import "../app.css"
    import { onMount } from "svelte"
    import connectWallet from "$lib/utils/connectWallet"
    import ethersStore from "$lib/store/ethersStore"
    import { ethers } from "ethers"
    import { addressBalance, addressNonce } from "$lib/utils/ethersAccounts"
    import { blockNr, blockData } from "$lib/utils/ethersBlocks"
    import lottery from "$lib/contracts/Lottery"
    import { connectToContract, connectSignerToContract } from "$lib/utils/ethersContracts"
    import TrReceipt from "$lib/components/trReceipt.svelte"
    import { sliceAddress, roundedBalanceEthFromWei } from "$lib/utils/various"

    let balance
    //let lotteryAddress = import.meta.env.VITE_CONTRACT_ADDRESS_RINKEBY
    let lotteryAddress = "0xa64F2a1da8559f52844029D6E401Dc916D15Fd0a"
    let nonce
    let block, blockDt, blockTS, blockTrans
    let { abi, contractName } = lottery
    let contractLottery
    let sendPlayerContract = false
    let playerContractReply = false
    let transactionReceipt = null
    let transactionError = null

    $: slicedSigner = sliceAddress($ethersStore.signerAddress)
    $: balanceSigner = roundedBalanceEthFromWei($ethersStore.balance, 8)

    onMount(async () => {
        await connectContract()
    })

    async function connectContract() {
        await connectWallet()
        await providerAccountFunctions()
        await providerBlockFunctions()
        await contractLotteryFunctions()
        await lotteryGetData()
    }

    async function providerAccountFunctions() {
        balance = await addressBalance()
        nonce = await addressNonce()
    }

    async function providerBlockFunctions() {
        block = await blockNr()
        blockDt = await blockData(block)
        blockTS = blockDt.timestamp
    }

    async function contractLotteryFunctions() {
        contractLottery = await connectToContract(lotteryAddress, abi)
        connectSignerToContract(contractLottery)
    }

    let totalPlayers
    let lotteryFee
    let recentWinner
    let lastTimeStamp
    let players = ["No players"]

    async function lotteryGetData() {
        // run specific functions of the contract that are with no state change
        totalPlayers = await contractLottery.getNumberOfPlayers()
        lotteryFee = ethers.utils.formatEther(await contractLottery.getEntranceFee())
        recentWinner = sliceAddress(await contractLottery.getRecentWinner())
        lastTimeStamp = await contractLottery.getLastTimeStamp()
        for (let i = 0; i < totalPlayers; i++) {
            players[i] = sliceAddress(await contractLottery.getPlayer(0))
        }
        console.log("players", players[0])
    }

    async function enterLottery() {
        sendPlayerContract = true
        let tx
        try {
            tx = await contractLottery.enterLottery({
                value: ethers.utils.parseUnits("0.1", "ether"),
                // gasLimit: 1000000,
            })
            transactionReceipt = await tx.wait()
            playerContractReply = true
            console.log("transactionReceipt: ", transactionReceipt)
            lotteryGetData()
            sendPlayerContract = false
            console.error("vgika trans")
        } catch (error) {
            console.log(error)
            playerContractReply = true
            lotteryGetData()
            transactionError = { error }
            sendPlayerContract = false
        }
    }

    const toggleMessage = () => {
        playerContractReply = false
    }
</script>

<!-- Initial div to justify header footer and main -->
<div class="flex flex-col h-screen justify-between">
    <header class="h-10">
        <!-- Nav Bar start -->
        <div class="navbar bg-base-100 border-y-4">
            <div class="flex-none">
                <button class="btn btn-square btn-ghost">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        class="inline-block w-5 h-5 stroke-current"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        /></svg
                    >
                </button>
            </div>
            <div class="flex-1">
                {#if $ethersStore.walletConnected == false}
                    <!-- do nothing -->
                {:else}
                    <!-- <a class="btn btn-ghost normal-case text-xl">Connected</a> -->
                    <!-- Daisiui Stat to show values start  -->
                    <div class="stats shadow">
                        <div class="stat">
                            <div class="stat-title">Nonce</div>
                            <div class="stat-value text-primary">{nonce}</div>
                            <div class="stat-desc">count of transactions</div>
                        </div>

                        <div class="stat">
                            <div class="stat-title">Block Nr.</div>
                            <div class="stat-value text-secondary">{block}</div>
                            <div class="stat-desc">Block latest refresh</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title">Block Time</div>
                            <div class="stat-value text-secondary">{blockTS}</div>
                            <div class="stat-desc">Block Timestamp</div>
                        </div>
                    </div>
                    <!-- Daisiui Stat to show values end  -->
                {/if}
            </div>
            <div class="flex-none normal-case text-xl font-bold ">
                <!-- navbar daisyui component -->
            </div>
            {#if $ethersStore.walletConnected == true}
                <div class="stats shadow">
                    <div class="flex-none">
                        <div class="stat">
                            <div class="stat-title">Account balance</div>
                            <div class="stat-value">{balanceSigner}</div>
                            <div class="stat-actions">
                                <button class="btn btn-sm btn-success">Add funds</button>
                            </div>
                        </div>
                    </div>
                    <div class="flex-none">
                        <div class="stat">
                            <div class="stat-title">Address</div>
                            <div class="stat-value">{slicedSigner}</div>
                            <div class="stat-actions">
                                <button class="btn btn-sm btn-failure">Disconnect</button>
                            </div>
                        </div>
                    </div>

                    <div class="flex-none">
                        <div class="stat">
                            <div class="stat-figure text-secondary">
                                <div class="avatar online">
                                    <div class="w-16 rounded-full">
                                        <img src="connection.jpg" alt="Connected" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                <div class="stats shadow">
                    <div class="flex-none">
                        <div class="stat">
                            <div class="stat-figure text-secondary">
                                <div class="avatar online">
                                    <div class="w-16 rounded-full">
                                        <img src="noConnection.jpg" alt="Disconnected" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
            <div />
            <!-- Nav Bar End -->
        </div>
    </header>

    <main class="mb-auto h-10 ">
        <div class="w-full ">
            {#if $ethersStore.walletConnected == false}
                <button class="btn btn-wide flex-none" on:click={connectContract}>Connect</button>
            {/if}
            <!-- Modal daisyui component -->
            <input type="checkbox" id="my-modal-5" class="modal-toggle" />
            <div class="modal">
                <!-- <div class="modal modal-bottom sm:modal-middle"> -->
                <div class="modal-box w-11/12 max-w-5xl">
                    <h3 class="font-bold text-lg">
                        {#if transactionError !== null}
                            Transaction Error!
                        {:else}
                            You have joined the lottery. Good luck!
                        {/if}
                    </h3>
                    <p class="py-4">
                        <TrReceipt
                            transReceipt={transactionReceipt}
                            transError={transactionError}
                        />
                    </p>
                    <div class="modal-action">
                        <label for="my-modal-5" class="btn" on:click={toggleMessage}>OK</label>
                    </div>
                </div>
            </div>

            <!-- Leave a space between the navigator and the content -->
            <div class="h-20 m-8" />

            <!-- here make 4 divs equal size  -->
            <div class="flex ...">
                <div class="w-1/4 ... place-content-center" />
                <div class="w-1/4 ... place-content-center">
                    <div class="stats stats-vertical shadow">
                        <div class="stat">
                            <div class="stat-title">Lottery Fee</div>
                            <div class="stat-value">{lotteryFee}</div>
                            <div class="stat-desc">Minimum fee to enter</div>
                        </div>

                        <div class="stat">
                            <div class="stat-title">Total players</div>
                            <div class="stat-value">{totalPlayers}</div>
                            <div class="stat-desc">Participation count</div>
                        </div>

                        <div class="stat">
                            <div class="stat-title">Last winner</div>
                            <div class="stat-value">{recentWinner}</div>
                            <div class="stat-desc">Last winner address</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title">Players</div>
                            <div class="stat-value">
                                {#each players as player, index}
                                    {index} - {player}<br />
                                {/each}
                            </div>
                            <div class="stat-desc">Players taking part</div>
                        </div>
                    </div>
                </div>
                <div class="w-1/4 ... place-content-center">
                    <tr class="center">
                        {#if sendPlayerContract}
                            <button class="btn loading btn-wide" disabled>Lottery</button>
                        {:else}
                            <button class="btn btn-wide" on:click={enterLottery}
                                >Enter Lottery</button
                            >
                        {/if}
                    </tr>
                    <tr>
                        <br />
                        <hr />
                        <br />
                    </tr>
                    <tr>
                        {#if playerContractReply}
                            <div class="alert shadow-lg">
                                <div>
                                    <svg
                                        xmlns="www.saga.net"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        class="stroke-info flex-shrink-0 w-6 h-6"
                                        ><path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        /></svg
                                    >
                                    <div>
                                        <h3 class="font-bold">New message!</h3>
                                        <div class="text-xs">You have 1 unread message</div>
                                    </div>
                                </div>
                                <div class="flex-none">
                                    <label for="my-modal-5" class="btn modal-button">see</label>
                                </div>
                            </div>
                        {/if}
                    </tr>
                </div>
                <div class="w-1/4 ... place-content-center" />
            </div>
        </div>
        <div class="h-full" />
    </main>

    <footer class="footer items-center p-4 bg-neutral text-neutral-content h-10">
        <div class="items-center grid-flow-col">
            <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                xmlns="http://www.saga.net"
                fill-rule="evenodd"
                clip-rule="evenodd"
                class="fill-current"
                ><path
                    d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"
                /></svg
            >
            <p>Copyright © 2022 - All right reserved</p>
        </div>
        <div class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            <!--  <a
                ><svg
                    xmlns="http://www.saga.net"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    class="fill-current"
                    ><path
                        d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                    /></svg
                >
            </a>
            <a
                ><svg
                    xmlns="http://www.saga.net"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    class="fill-current"
                    ><path
                        d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
                    /></svg
                ></a
            >
            <a
                ><svg
                    xmlns="http://www.saga.net"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    class="fill-current"
                    ><path
                        d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
                    /></svg
                ></a 
            > -->
        </div>
    </footer>
</div>
