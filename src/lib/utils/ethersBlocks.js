import ethersStore from "$lib/store/ethersStore"
import { get } from "svelte/store"
import { ethers } from "ethers"

//funcions that use the provider from ethersStore and return Block data based on parameters

// returns the block data of a specific block in json format
async function blockNr() {
    let blckData
    blckData = await get(ethersStore).provider.getBlockNumber()
    return blckData
}

// returns the block data of a specific block in json format
async function blockData(_blockNr) {
    let blckData
    blckData = await get(ethersStore).provider.getBlock(_blockNr)
    return blckData
}

async function blockDatawithTransactions(_blockNr) {
    let blckData
    blckData = await get(ethersStore).provider.getBlockWithTransactions(_blockNr)
    return blckData
}

export { blockNr, blockData, blockDatawithTransactions }

//we can import above functions from the js and use them anywhere
//import { blockNr, blockData, blockDatawithTransactions } from "$lib/utils/ethersBlocks"
//let block, blockDt, blockTS
//async function providerBlockFunctions() {
//    block = await blockNr()
//    blockDt = await blockData(block)
//    blockTS = blockDt.timestamp
//   blockDt = await blockData(10815949) // object shoing it in the console
//   console.log("Block 10815949 data :", blockDt)
//   blockTrans = await blockDatawithTransactions(10815949) // object showing it in the console
//   console.log("Block 10815949 transactions :", blockTrans)
//}
