/**
 * @fileoverview 以下のQiita記事のjsをtypescript化
 * @see https://qiita.com/michimichix521/items/1485f05a45a37d7ffe08
 */

import SHA256 from 'crypto-js/sha256'

type BlockParams = {
  index: number
  timestamp: string
  data: string | Record<string, unknown>
}

type Block = BlockParams & {
  previousHash: string
  hash: string
}

class Blockchain {
  private readonly chain: Block[]

  constructor(genesisBlockParams: BlockParams) {
    this.chain = [
      {
        ...genesisBlockParams,
        previousHash: '0',
        hash: this.calculateHash(genesisBlockParams, '0'),
      },
    ]
  }

  public addBlock(newBlockParams: BlockParams): void {
    const previousHash = this.getLatestBlock().hash
    if (!previousHash) throw Error('previous hash is not defined')
    this.chain.push({
      ...newBlockParams,
      previousHash,
      hash: this.calculateHash(newBlockParams, previousHash),
    })
  }
  private getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }
  private calculateHash({ index, timestamp, data }: BlockParams, previousHash: string): string {
    return SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString()
  }
}

const coin = new Blockchain({
  index: 0,
  timestamp: '2019/01/01',
  data: 'Genesis block',
})
coin.addBlock({ index: 1, timestamp: '2020/07/11', data: { amount: 10 } })
coin.addBlock({ index: 2, timestamp: '2020/07/12', data: { amount: 100 } })
coin.addBlock({ index: 3, timestamp: '2020/07/13', data: { amount: 1000 } })

console.log(JSON.stringify(coin, null, 4))
