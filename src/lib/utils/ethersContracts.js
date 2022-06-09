import ethersStore from "$lib/store/ethersStore"
import { get } from "svelte/store"
import { ethers } from "ethers"

//funcions that interact with contracts

// connect to a specific contract based on address, adi and if the connector is a signer or provider
// in case it is a provider, only transactions that dont change the state can be called
async function connectToContract(_address, _abi, _connector) {
    // if no connector is passed, the store signer will ne used, if it is null then the default provider will
    // be used. the address and the abi will come directly from the static contract data that are saved during
    // the deploy pfase
    let contract
    if (!_connector) {
        contract = new ethers.Contract(_address, _abi, _connector)
    } else {
        contract = new ethers.Contract(_address, _abi, get(ethersStore).signer)
    }
    return contract
}

export { connectToContract }
