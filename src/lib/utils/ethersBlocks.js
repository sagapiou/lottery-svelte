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
