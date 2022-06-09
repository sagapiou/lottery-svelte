<script>
    import "../app.css"
    import { onMount } from "svelte"
    import connectWallet from "$lib/utils/connectWallet"
    import ethersStore from "$lib/store/ethersStore"
    import { ethers } from "ethers"
    import {
        addressBalance,
        addressCode,
        storageAtSlot,
        addressNonce,
    } from "$lib/utils/ethersAccounts"
    import { blockNr, blockData, blockDatawithTransactions } from "$lib/utils/ethersBlocks"
    import lottery from "$lib/contracts/Lottery"
    import { connectToContract, connectSignerToContract } from "$lib/utils/ethersContracts"
    import TrReceipt from "$lib/components/trReceipt.svelte"

    let balance
    let code, lotteryCode
    let lotteryAddress = import.meta.env.VITE_CONTRACT_ADDRESS_RINKEBY
    let storageSlot0Lottery, storageSlot1Lottery
    let nonce
    let block, blockDt, blockTS, blockTrans
    let { abi, contractName } = lottery
    let contractLottery
    let sendPlayerContract = false
    let playerContractReply = false
    let transactionReceipt = null

    onMount(async () => {
        await connectWallet()
        await providerAccountFunctions()
        await providerBlockFunctions()
        await contractLotteryFunctions()
        await lotteryGetData()
    })

    async function providerAccountFunctions() {
        balance = await addressBalance()
        //   code = await addressCode()
        //   lotteryCode = await addressCode(lotteryAddress) // too long to show
        //   //console.log("lotteryCode:", lotteryCode)
        //   storageSlot0Lottery = await storageAtSlot(lotteryAddress, 0)
        //   storageSlot1Lottery = await storageAtSlot(lotteryAddress, 1)
        nonce = await addressNonce()
    }

    async function providerBlockFunctions() {
        block = await blockNr()
        blockDt = await blockData(block)
        blockTS = blockDt.timestamp
        //   blockDt = await blockData(10815949) // object shoing it in the console
        //   console.log("Block 10815949 data :", blockDt)
        //   blockTrans = await blockDatawithTransactions(10815949) // object showing it in the console
        //   console.log("Block 10815949 transactions :", blockTrans)
    }

    async function contractLotteryFunctions() {
        // if no signer is passed then the store signer will be used and if thereis no signer the provider
        contractLottery = await connectToContract(lotteryAddress, abi)

        // contract properties :
        // console.log("contract address :", contractLottery.address)
        // console.log("resolvedAddress: ", contractLottery.resolvedAddress)
        // console.log("deployTransaction: ", contractLottery.deployTransaction) // if produced by a contract factory
        // console.log("abi: ", contractLottery.interface) // abi
        // console.log("provider :", contractLottery.provider)
        // console.log("signer :", contractLottery.signer )

        //contract methods
        //console.log("is contract deployed :", await contractLottery.deployed()) //returns the contract
        //console.log("is value indexed :", contractLottery.isIndexed( value ))

        // change signer of the contract
        //connectSignerToContract(contractLottery)
    }

    let totalPlayers
    let lotteryFee
    let recentWinner
    let lastTimeStamp
    let players = []
    async function lotteryGetData() {
        // run specific functions of the contract that are with no state change
        totalPlayers = await contractLottery.getNumberOfPlayers()
        lotteryFee = ethers.utils.formatEther(await contractLottery.getEntranceFee())
        recentWinner = await contractLottery.getRecentWinner()
        lastTimeStamp = await contractLottery.getLastTimeStamp()
        for (let i = 0; i < totalPlayers; i++) {
            players.push(await contractLottery.getPlayer(0))
        }
    }

    async function enterLottery() {
        sendPlayerContract = true
        let tx = await contractLottery.enterLottery({
            value: ethers.utils.parseUnits("0.1", "ether"),
        })
        transactionReceipt = await tx.wait(1)
        playerContractReply = true
        console.log("transactionReceipt: ", transactionReceipt)
        lotteryGetData()
        sendPlayerContract = false
    }

    const toggleMessage = () => {
        playerContractReply = false
    }
</script>

<header>
    balance: {balance}<br />
    <!-- code at signer address: {code}<br>
    lottery slot 0: {storageSlot0Lottery}<br> 
    lottery slot 1: {storageSlot1Lottery}<br> -->
    signer nonce: {nonce}<br />
    ----------------------------------------------------------<br />
    block : {block}-{blockTS}<br />
    ----------------------------------------------------------<br />
</header>

<main>
    <div class="w-full">
        <input type="checkbox" id="my-modal-6" class="modal-toggle" />
        <div class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
                <h3 class="font-bold text-lg">Congratulations random Interner user!</h3>
                <p class="py-4">
                    <TrReceipt transReceipt={transactionReceipt} />
                </p>
                <div class="modal-action">
                    <label for="my-modal-6" class="btn" on:click={toggleMessage}>Yay!</label>
                </div>
            </div>
        </div>

        <div class="flex ...">
            <div class="w-1/4 ... place-content-center" />
            <div class="w-1/4 ... place-content-center">
                <div>
                    <h1>Lottery details :</h1>
                    <br />
                    <hr />
                    <br />
                    <h2>lotteryFee : {lotteryFee} ETH</h2>
                    <br />
                    <h2>totalPlayers : {totalPlayers}</h2>
                    <br />
                    <h2>recentWinner : {recentWinner}</h2>
                    <br />
                    <h2>lastTimeStamp : {lastTimeStamp}</h2>
                    <br />
                    <h2>totalTimeFromLastWinner : {blockTS - lastTimeStamp}</h2>
                    <br />
                    <h2>players : {players}</h2>
                    {#each players as player}
                        <li>{player}</li>
                    {/each}
                </div>
            </div>
            <div class="w-1/4 ... place-content-center">
                <tr class="center">
                    {#if sendPlayerContract}
                        <button class="btn loading" disabled>Lottery</button>
                    {:else}
                        <button class="btn" on:click={enterLottery}>Enter Lottery</button>
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
                                <label for="my-modal-6" class="btn modal-button">see</label>
                            </div>
                        </div>
                    {/if}
                </tr>
            </div>
            <div class="w-1/4 ... place-content-center" />
        </div>
    </div>
</main>
