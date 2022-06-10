import ethersStore from "$lib/store/ethersStore"
import { get } from "svelte/store"
import { ethers } from "ethers"

//funcions that use the provider from ethersStore and return data based on parameters

// returns the balance of a specific address
async function addressBalance(_address) {
    // if no address is passed the signers balance is returned
    // The balance is in ethers rounded to 6 decimals
    let balance
    if (typeof _address !== "undefined" && _address !== null) {
        balance = await get(ethersStore).provider.getBalance(_address)
    } else {
        balance = await get(ethersStore).provider.getBalance(get(ethersStore).signerAddress)
    }
    balance = Math.round(ethers.utils.formatEther(balance) * 1e6) / 1e6
    return balance
}

//returns the code at a specific address
async function addressCode(_address) {
    // if no address is passed the signers balance is used and 0x0 is returned
    let code
    if (typeof _address !== "undefined" && _address !== null) {
        code = await get(ethersStore).provider.getCode(_address)
    } else {
        code = await get(ethersStore).provider.getCode(get(ethersStore).signerAddress)
    }
    return code
}

async function storageAtSlot(_address, _slot) {
    // this function returns the storage value of a specific contract at a specific slot
    let storage
    storage = await get(ethersStore).provider.getStorageAt(_address, _slot)
    return storage
}

async function addressNonce(_address) {
    // this function returns the nonce of a specific address
    //in ethereum nonce reporesents the number of transactions an EOA has sent
    // in case of a contract it is the number of deployments this contracts has done (if it is a factory contract)
    let nonce
    if (typeof _address !== "undefined" && _address !== null) {
        nonce = await get(ethersStore).provider.getTransactionCount(_address)
    } else {
        nonce = await get(ethersStore).provider.getTransactionCount(get(ethersStore).signerAddress)
    }
    return nonce
}

export { addressBalance, addressCode, storageAtSlot, addressNonce }

//we can import above functions and use them from anywhere
//     import {addressBalance,addressCode,storageAtSlot,addressNonce,} from "$lib/utils/ethersAccounts"
//
//     let balance
//     let code, lotteryCode
//     let storageSlot0Lottery, storageSlot1Lottery
//     let nonce
//async function providerAccountFunctions() {
//    balance = await addressBalance()
//   code = await addressCode()
//   lotteryCode = await addressCode(lotteryAddress) // too long to show
//   //console.log("lotteryCode:", lotteryCode)
//   storageSlot0Lottery = await storageAtSlot(lotteryAddress, 0)
//   storageSlot1Lottery = await storageAtSlot(lotteryAddress, 1)
//    nonce = await addressNonce()
//}
