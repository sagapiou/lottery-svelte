import { writable } from "svelte/store"
import { ethers } from "ethers"

// to use the mainnet
//const network = "homestead";
const network = "rinkeby"

// default provider
const defaultProvider = ethers.getDefaultProvider(network, {
    etherscan: import.meta.env.VITE_ETHERSCAN_API_KEY,
    infura: import.meta.env.VITE_INFURA_RINKEBY_RPC_URL,
})

const ethersStore = writable({
    defaultProvider: defaultProvider,
    signer: null,
    signerAddress: "",
    selectedChainId: -1,
    selectedChainName: "",
    walletConnected: false,
    balance: 0,
    provider: null,
    eipProvider: null,
    evmProviderType: "EIP1193", // eg metamask
})

const customEthersStore = {
    subscribe: ethersStore.subscribe,
    resetConnection: () => {
        ethersStore.update((state) => {
            return {
                ...state,
                provider: null,
                signer: null,
                signerAddress: "",
                selectedChainName: "",
                selectedChainId: -1,
                walletConnected: false,
            }
        })
    },

    newProvider: (_provider, _signer, _signerAddress, _name, _chainId, _balance) => {
        ethersStore.update((state) => {
            return {
                ...state,
                provider: _provider,
                signer: _signer,
                signerAddress: _signerAddress,
                selectedChainName: _name,
                selectedChainId: _chainId,
                walletConnected: true,
                balance: _balance,
            }
        })
    },

    changeAccount: (_signer, _signerAddress, _balance) => {
        ethersStore.update((state) => {
            return {
                ...state,
                signer: _signer,
                signerAddress: _signerAddress,
                balance: _balance,
            }
        })
    },
}

export default customEthersStore
