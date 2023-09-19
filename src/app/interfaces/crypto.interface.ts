interface INativeCurrency {
    decimals: number,
    name: string,
    symbol: string
}

export interface IChain {
    chainId: number,
    faucets: [],
    infoURL: string,
    name: string,
    nativeCurrency: INativeCurrency,
    networkId: number,
    rpc: string[],
    shortName: string
}
