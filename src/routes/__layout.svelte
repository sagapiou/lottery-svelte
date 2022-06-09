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

    let balance
    let code, lotteryCode
    let lotteryAddress = import.meta.env.VITE_CONTRACT_ADDRESS_RINKEBY
    let storageSlot0Lottery, storageSlot1Lottery
    let nonce
    let block, blockDt, blockTS, blockTrans
    let { abi, contractName } = lottery
    let contractLottery
    let sendPlayerContract = false

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
        let transactionReceipt = await tx.wait(1)
        console.log("transactionReceipt: ", transactionReceipt)
        lotteryGetData()
        sendPlayerContract = false
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
    <div>
        Lottery details : <br />
        lotteryFee : {lotteryFee} ETH<br />
        totalPlayers : {totalPlayers}<br />
        recentWinner : {recentWinner}<br />
        lastTimeStamp : {lastTimeStamp}<br />
        totalTimeFromLastWinner : {blockTS - lastTimeStamp}<br />
        players : {players}
        {#each players as player}
            <li>{player}</li>
        {/each}
        <br />
        <br />
    </div>
    {#if sendPlayerContract}
        <button class="btn loading" disabled>Lottery</button>
    {:else}
        <button class="btn" on:click={enterLottery}>Enter Lottery</button>
    {/if}
</main>

<footer>
    <p>Brought to you by ...</p>
</footer>

<style>
    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 1024px;
        margin: 0 auto;
        box-sizing: border-box;
    }

    header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
    }

    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
    }

    footer a {
        font-weight: bold;
    }

    @media (min-width: 480px) {
        footer {
            padding: 40px 0;
        }
    }

    button {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 10em;
    }
</style>
