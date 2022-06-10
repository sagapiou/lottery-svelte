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
    if (typeof _connector !== "undefined" && _connector !== null) {
        contract = new ethers.Contract(_address, _abi, _connector)
    } else {
        if (get(ethersStore).signer == null) {
            // if there is no signer in the store, the default provider will be used so only
            // view (that dont cost any gas) functions can be called
            contract = new ethers.Contract(_address, _abi, get(ethersStore).provider)
        } else {
            contract = new ethers.Contract(_address, _abi, get(ethersStore).signer)
        }
    }
    return contract
}

// change the signer or povider connected to the contract
async function connectSignerToContract(_contract, _connector) {
    // if no connector is passed, the store signer will ne used, if it is null then the default provider will
    // be used. the address and the abi will come directly from the static contract data that are saved during
    // the deploy pfase
    let contract
    if (typeof _connector !== "undefined" && _connector !== null) {
        contract = _contract.connect(_connector)
    } else {
        if (get(ethersStore).signer == null) {
            // if there is no signer in the store, the default provider will be used so only
            // view (that dont cost any gas) functions can be called
            contract = _contract.connect(get(ethersStore).provider)
        } else {
            contract = _contract.connect(get(ethersStore).signer)
        }
    }
    return contract
}

export { connectToContract, connectSignerToContract }

// function to use once we have imported above js that returns all the contract properties and methods
//async function contractLotteryFunctions() {
// if no signer is passed then the store signer will be used and if thereis no signer the provider
//    contractLottery = await connectToContract(lotteryAddress, abi)

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
//}
