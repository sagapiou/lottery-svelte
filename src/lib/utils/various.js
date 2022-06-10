import { ethers } from "ethers"

function sliceAddress(_address) {
    return _address.slice(0, 6) + "..." + _address.slice(_address.length - 4, _address.length)
}

function roundedBalanceEthFromWei(_balance, _decimals) {
    let balance
    // check the _decimals value. Default is 6 if not declared
    if (typeof _decimals == "undefined" || _decimals == null) {
        balance = Math.round(ethers.utils.formatEther(balance) * 1e6) / 1e6
    } else {
        let decimals = Math.pow(10, _decimals)
        balance = Math.round(ethers.utils.formatEther(_balance) * decimals) / decimals
    }
    return balance
}

export { sliceAddress, roundedBalanceEthFromWei }
