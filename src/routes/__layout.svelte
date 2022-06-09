<!-- <script>
import "../app.css"
import { onMount } from "svelte"
import connectWallet from "$lib/utils/connectWallet"
import ethersStore from "$lib/store/ethersStore"
import {addressBalance, addressCode, storageAtSlot, addressNonce} from "$lib/utils/ethersAccounts"
import {blockNr, blockData, blockDatawithTransactions} from "$lib/utils/ethersBlocks"


let balance
let code, lotteryCode 
let lotteryAddress = import.meta.env.VITE_CONTRACT_ADDRESS_RINKEBY
let storageSlot0Lottery,storageSlot1Lottery 
let nonce
let block, blockDt, blockTrans

onMount (async () => {
  await connectWallet()
  await providerAccountFunctions()
  await providerBlockFunctions()
})

async function providerAccountFunctions() {
  balance = await addressBalance()
  code = await addressCode()
  lotteryCode = await addressCode(lotteryAddress) // too long to show
  // console.log("lotteryCode:", lotteryCode)
  storageSlot0Lottery = await storageAtSlot(lotteryAddress, 0)
  storageSlot1Lottery = await storageAtSlot(lotteryAddress, 1)
  nonce = await addressNonce() 
}  

async function providerBlockFunctions() {
  block = await blockNr()
  blockDt = await blockData(10815949) // object shoing it in the console
  //console.log("Block 10815949 data :", blockDt)
  blockTrans = await blockDatawithTransactions(10815949) // object showing it in the console
  //console.log("Block 10815949 transactions :", blockTrans)

}

async function contractLotteryFunctions() {

}

</script> -->

<header>
    <!-- balance: {balance}<br>
    code at signer address: {code}<br>
    lottery slot 0: {storageSlot0Lottery}<br> 
    lottery slot 1: {storageSlot1Lottery}<br>
    signer nonce: {nonce}<br>
    ----------------------------------------------------------<br>
    block : {block}<br>
    ----------------------------------------------------------<br> -->
    
</header>

<main>
    <slot />
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
</style>